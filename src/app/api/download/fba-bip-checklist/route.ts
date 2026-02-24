export const dynamic = "force-dynamic";

import { NextRequest } from 'next/server'

// Generate a minimal one-page PDF with a title and checklist lines.
// No external deps; builds a valid PDF 1.4 byte stream with Helvetica.

function escapePdfText(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)')
}

function buildPdf(title: string, lines: string[]) {
  const objects: string[] = []
  const offsets: number[] = [0] // xref starts with free object 0
  let pdf = '%PDF-1.4\n'

  function addObject(obj: string) {
    offsets.push(pdf.length)
    pdf += obj
  }

  // 1: Catalog
  addObject('1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n')
  // 2: Pages
  addObject('2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n')
  // 3: Page
  addObject('3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>\nendobj\n')
  // 4: Font
  addObject('4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n')

  // 5: Contents stream
  const yStart = 760
  let y = yStart
  const contentParts: string[] = []
  contentParts.push('BT')
  contentParts.push('/F1 18 Tf')
  contentParts.push(`72 ${y} Td (${escapePdfText(title)}) Tj`)
  y -= 28
  contentParts.push('/F1 12 Tf')
  for (const line of lines) {
    contentParts.push(`72 ${y} Td (${escapePdfText('• ' + line)}) Tj`)
    y -= 18
  }
  contentParts.push('ET')
  const content = contentParts.join('\n') + '\n'
  const streamHeader = `5 0 obj\n<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n`
  const streamFooter = 'endstream\nendobj\n'
  addObject(streamHeader + content + streamFooter)

  // xref
  const xrefOffset = pdf.length
  let xref = `xref\n0 ${offsets.length}\n`
  xref += '0000000000 65535 f \n'
  for (let i = 1; i < offsets.length; i++) {
    xref += (offsets[i].toString().padStart(10, '0') + ' 00000 n \n')
  }
  const trailer = `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`
  return Buffer.from(pdf + xref + trailer, 'utf8')
}

export async function GET(_req: NextRequest) {
  const title = 'PBIS‑aligned Tier 3 FBA→BIP Checklist'
  const items = [
    'Form team; consent; define routines of concern',
    'Plan FBA; select interviews + ABC/scatterplot tools',
    'Collect baseline data across settings/times',
    'Analyze patterns; generate function hypotheses',
    'Design BIP: prevention, replacement skills, consequences, safety link',
    'Train implementers; set brief fidelity checks (10–20%)',
    'Monitor weekly: outcomes + integrity; adjust with decision rules',
    'Align measurable IEP goals; document progress + decisions'
  ]
  const pdf = buildPdf(title, items)
  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="fba-bip-checklist.pdf"',
      'Cache-Control': 'no-store, no-cache, must-revalidate',
      'X-Robots-Tag': 'noindex, nofollow'
    }
  })
}


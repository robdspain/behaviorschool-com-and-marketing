import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function textFromCsv(input: string) {
  try {
    // Simple CSV to text: join cells with spaces, rows with newlines
    return input
      .split(/\r?\n/)
      .map((row) => row.split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((c) => c.replace(/^"|"$/g, '')).join(' '))
      .join('\n');
  } catch {
    return input;
  }
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const files: File[] = [];
    const single = form.get('file');
    if (single instanceof File) files.push(single);
    // Support multiple under 'file' and 'files'
    for (const [k, v] of form.entries()) {
      if ((k === 'file' || k === 'files') && v instanceof File && !files.includes(v)) files.push(v);
    }

    if (!files.length) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const texts: string[] = [];
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const filename = (file.name || '').toLowerCase();

    if (filename.endsWith('.pdf') || file.type === 'application/pdf') {
      const result = await pdfParse(buffer);
      const text = (result.text || '').trim();
      if (!text) throw new Error('No extractable text found in PDF');
      texts.push(text);
    }

    if (filename.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer });
      const text = (result.value || '').trim();
      if (!text) throw new Error('No extractable text found in DOCX');
      texts.push(text);
    }

    if (filename.endsWith('.txt') || file.type.startsWith('text/')) {
      const text = buffer.toString('utf8');
      texts.push(text);
    }

    if (filename.endsWith('.csv') || file.type === 'text/csv' || file.type === 'application/csv') {
      const raw = buffer.toString('utf8');
      const text = textFromCsv(raw);
      texts.push(text);
    }
    }

    if (!texts.length) {
      return NextResponse.json({ error: 'Unsupported file type. Supported: PDF, DOCX, TXT, CSV' }, { status: 400 });
    }
    const combined = texts.join('\n\n');
    return NextResponse.json({ ok: true, text: combined, parts: texts.length });
  } catch (error) {
    console.error('File extract error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Failed to process file' }, { status: 500 });
  }
}

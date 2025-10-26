import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface MasterclassCertificateTemplateData {
  certificateId: string;
  recipientName: string;
  courseTitle: string;
  completionDate: string;
  ceuCredits: number;
  bacbCertNumber: string;
  providerNumber: string;
  organizationName: string;
  organizationWebsite?: string;
  certificateSubtitle?: string;
  completionStatement: string;
  signatureName?: string;
  signatureTitle?: string;
}

function formatCompletionDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export async function generateMasterclassCertificatePdf(
  data: MasterclassCertificateTemplateData
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([792, 612]); // Landscape US Letter
  const { width, height } = page.getSize();

  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Background frame
  page.drawRectangle({
    x: 24,
    y: 24,
    width: width - 48,
    height: height - 48,
    color: rgb(0.972, 0.984, 0.976),
    borderWidth: 3,
    borderColor: rgb(0.117, 0.549, 0.431),
  });

  const drawCenteredText = (
    text: string,
    y: number,
    font = helvetica,
    size = 14,
    color = rgb(0.106, 0.106, 0.106)
  ) => {
    const textWidth = font.widthOfTextAtSize(text, size);
    const x = (width - textWidth) / 2;
    page.drawText(text, { x, y, size, font, color });
  };

  drawCenteredText('Certificate of Completion', height - 110, helveticaBold, 32, rgb(0.078, 0.384, 0.305));

  if (data.certificateSubtitle) {
    drawCenteredText(data.certificateSubtitle, height - 150, helvetica, 16, rgb(0.2, 0.2, 0.2));
  }

  drawCenteredText('This certifies that', height - 195, helvetica, 14, rgb(0.286, 0.286, 0.286));
  drawCenteredText(data.recipientName, height - 235, helveticaBold, 28, rgb(0.071, 0.353, 0.278));

  const completionStatement = data.completionStatement || 'has successfully completed the required course work';
  drawCenteredText(completionStatement, height - 275, helvetica, 14);

  drawCenteredText(`Course: ${data.courseTitle}`, height - 315, helveticaBold, 16);
  drawCenteredText(`CEU Credits Awarded: ${data.ceuCredits.toFixed(1)}`, height - 345, helvetica, 14);
  drawCenteredText(`Completion Date: ${formatCompletionDate(data.completionDate)}`, height - 375, helvetica, 14);

  // Detail lines
  const leftColumnX = 120;
  const detailY = 180;
  const lineGap = 22;

  page.drawText(`BACB Certificate #: ${data.bacbCertNumber}`, {
    x: leftColumnX,
    y: detailY,
    font: helvetica,
    size: 12,
    color: rgb(0.16, 0.16, 0.16),
  });

  page.drawText(`BACB Provider #: ${data.providerNumber}`, {
    x: leftColumnX,
    y: detailY - lineGap,
    font: helvetica,
    size: 12,
    color: rgb(0.16, 0.16, 0.16),
  });

  page.drawText(`Organization: ${data.organizationName}`, {
    x: leftColumnX,
    y: detailY - lineGap * 2,
    font: helvetica,
    size: 12,
    color: rgb(0.16, 0.16, 0.16),
  });

  if (data.organizationWebsite) {
    page.drawText(`Website: ${data.organizationWebsite}`, {
      x: leftColumnX,
      y: detailY - lineGap * 3,
      font: helvetica,
      size: 12,
      color: rgb(0.16, 0.16, 0.16),
    });
  }

  // Signature block
  const signatureY = 120;
  page.drawLine({
    start: { x: width / 2 - 150, y: signatureY },
    end: { x: width / 2 + 150, y: signatureY },
    color: rgb(0.117, 0.549, 0.431),
    thickness: 1.5,
  });

  if (data.signatureName) {
    drawCenteredText(data.signatureName, signatureY - 18, helveticaBold, 14);
  }

  if (data.signatureTitle) {
    drawCenteredText(data.signatureTitle, signatureY - 36, helvetica, 12);
  }

  // Footer with certificate ID
  drawCenteredText(`Certificate ID: ${data.certificateId}`, 60, helvetica, 10, rgb(0.4, 0.4, 0.4));

  return pdfDoc.save();
}

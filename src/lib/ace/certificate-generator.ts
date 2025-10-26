// ============================================================================
// ACE Platform - Certificate Generator
// ============================================================================

import type { AceCertificate, AceEvent, AceUser } from './types';

export interface CertificateData {
  certificateNumber: string;
  participantName: string;
  participantEmail: string;
  bacbNumber?: string;
  eventTitle: string;
  eventDate: string;
  instructorName: string;
  instructorCredentials: string;
  totalCeus: number;
  ceCategory: string;
  providerName: string;
  providerNumber?: string;
  eventModality: string;
  aceCoordinator?: string;
  issuedDate: string;
}

/**
 * Generate a unique certificate number
 * Format: CE-YYYY-XXXXXX
 */
export function generateCertificateNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
  return `CE-${year}-${random}`;
}

/**
 * Generate certificate HTML for PDF conversion or display
 */
export function generateCertificateHTML(data: CertificateData): string {
  const eventDateDisplay = new Date(data.eventDate).toLocaleString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  const issuedDateDisplay = new Date(data.issuedDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const bacbNumberDisplay = data.bacbNumber || 'Not provided';
  const instructorDisplay = data.instructorCredentials
    ? `${data.instructorName}${data.instructorCredentials ? `, ${data.instructorCredentials}` : ''}`
    : data.instructorName;
  const earnedCeusDisplay = `${data.totalCeus.toFixed(1)} CEUs`;
  const ceuTypeDisplay = data.ceCategory;
  const providerNumberDisplay = data.providerNumber || 'Not provided';
  const coordinatorDisplay = data.aceCoordinator || 'Not assigned';
  const eventModalityDisplay = data.eventModality || 'Not specified';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @page {
      size: letter landscape;
      margin: 0;
    }
    
    body {
      margin: 0;
      padding: 0;
      font-family: 'Georgia', 'Times New Roman', serif;
      background: white;
      width: 11in;
      height: 8.5in;
      display: flex;
      flex-direction: column;
      position: relative;
    }
    
    .certificate {
      width: 100%;
      height: 100%;
      padding: 0.75in;
      box-sizing: border-box;
      border: 20px solid #1F4D3F;
      position: relative;
      background: linear-gradient(135deg, #ffffff 0%, #fafcfb 100%);
    }
    
    .inner-border {
      border: 3px solid #D4AF37;
      width: 100%;
      height: 100%;
      padding: 40px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    
    .header {
      text-align: center;
      margin-bottom: 20px;
    }
    
    .logo {
      font-size: 32px;
      font-weight: bold;
      color: #1F4D3F;
      margin-bottom: 10px;
      letter-spacing: 2px;
    }
    
    .subtitle {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .main-title {
      font-size: 48px;
      font-weight: bold;
      color: #1F4D3F;
      text-align: center;
      margin: 20px 0;
      letter-spacing: 4px;
      text-transform: uppercase;
    }
    
    .presented-to {
      text-align: center;
      font-size: 18px;
      color: #666;
      margin-bottom: 10px;
      font-style: italic;
    }
    
    .participant-name {
      text-align: center;
      font-size: 42px;
      font-weight: bold;
      color: #1F4D3F;
      margin: 15px 0;
      border-bottom: 2px solid #1F4D3F;
      padding-bottom: 10px;
      display: inline-block;
      min-width: 500px;
    }
    
    .participant-container {
      text-align: center;
      margin: 20px 0;
    }
    
    .detail-grid {
      margin-top: 30px;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px 28px;
      background: #fffdf8;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }
    
    .detail-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 14px;
    }
    
    .detail-row:last-child {
      margin-bottom: 0;
    }
    
    .detail-label {
      flex: 0 0 220px;
      font-size: 12px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #1F4D3F;
      font-weight: 700;
    }
    
    .detail-value {
      flex: 1;
      font-size: 16px;
      color: #111827;
      font-weight: 600;
      line-height: 1.5;
      word-break: break-word;
    }
    
    .completion-text {
      text-align: center;
      font-size: 16px;
      color: #333;
      line-height: 1.8;
      margin: 20px auto;
      max-width: 700px;
    }
    
    .event-title {
      font-weight: bold;
      color: #1F4D3F;
      font-size: 18px;
    }
    
    .ceu-box {
      background: #F0F7F4;
      border: 2px solid #1F4D3F;
      border-radius: 8px;
      padding: 15px 30px;
      text-align: center;
      margin: 20px auto;
      display: inline-block;
    }
    
    .ceu-amount {
      font-size: 32px;
      font-weight: bold;
      color: #1F4D3F;
      margin-bottom: 5px;
    }
    
    .ceu-label {
      font-size: 14px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    
    .signatures {
      display: flex;
      justify-content: space-around;
      margin-top: 30px;
      padding-top: 20px;
    }
    
    .signature-block {
      text-align: center;
      flex: 1;
      padding: 0 20px;
    }
    
    .signature-line {
      border-top: 2px solid #333;
      margin-bottom: 8px;
      padding-top: 5px;
    }
    
    .signature-name {
      font-weight: bold;
      color: #1F4D3F;
      font-size: 16px;
      margin-bottom: 3px;
    }
    
    .signature-title {
      font-size: 13px;
      color: #666;
      font-style: italic;
    }
    
    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid #ddd;
      font-size: 11px;
      color: #666;
    }
    
    .certificate-number {
      font-weight: bold;
      color: #1F4D3F;
    }
    
    .bacb-info {
      text-align: center;
      font-size: 11px;
      color: #666;
      margin-top: 10px;
    }
    
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      font-size: 120px;
      color: rgba(31, 77, 63, 0.03);
      font-weight: bold;
      z-index: 0;
      pointer-events: none;
    }
    
    .content {
      position: relative;
      z-index: 1;
    }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="watermark">BEHAVIOR SCHOOL</div>
    <div class="inner-border">
      <div class="content">
        <div class="header">
          <div class="logo">BEHAVIOR SCHOOL</div>
          <div class="subtitle">Continuing Education Certificate</div>
        </div>
        
        <div class="main-title">Certificate of Completion</div>
        
        <div class="presented-to">This certifies that</div>
        
        <div class="participant-container">
          <div class="participant-name">${data.participantName}</div>
        </div>
        
        ${data.bacbNumber ? `
        <div style="text-align: center; font-size: 14px; color: #666; margin-top: -10px;">
          BACB Certification #: ${data.bacbNumber}
        </div>
        ` : ''}
        
        <div class="completion-text">
          has successfully completed the continuing education event
          <br/>
          <span class="event-title">${data.eventTitle}</span>
          <br/>
          on ${new Date(data.eventDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
        
        <div style="text-align: center;">
          <div class="ceu-box">
            <div class="ceu-amount">${data.totalCeus.toFixed(1)} CEUs</div>
            <div class="ceu-label">${data.ceCategory} Continuing Education</div>
          </div>
        </div>
        
        <div class="detail-grid">
          <div class="detail-row">
            <span class="detail-label">Date:</span>
            <span class="detail-value">${eventDateDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Participant:</span>
            <span class="detail-value">${data.participantName}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">BCBA Certification Number:</span>
            <span class="detail-value">${bacbNumberDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Title:</span>
            <span class="detail-value">${data.eventTitle}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Instructor:</span>
            <span class="detail-value">${instructorDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Earned CEUs:</span>
            <span class="detail-value">${earnedCeusDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">CEU Type:</span>
            <span class="detail-value">${ceuTypeDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Event Modality:</span>
            <span class="detail-value">${eventModalityDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ACE Provider Number:</span>
            <span class="detail-value">${providerNumberDisplay}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ACE Coordinator:</span>
            <span class="detail-value">${coordinatorDisplay}</span>
          </div>
        </div>
        
        <div class="signatures">
          <div class="signature-block">
            <div class="signature-line">
              <div class="signature-name">${data.instructorName}</div>
              <div class="signature-title">${data.instructorCredentials}</div>
              <div class="signature-title">Instructor</div>
            </div>
          </div>
          
          <div class="signature-block">
            <div class="signature-line">
              <div class="signature-name">${issuedDateDisplay}</div>
              <div class="signature-title">Date Issued</div>
            </div>
          </div>
        </div>
        
        <div class="footer">
          <div>
            <strong>${data.providerName}</strong>
            ${data.providerNumber ? `<br/>ACE Provider #: ${data.providerNumber}` : ''}
          </div>
          <div class="certificate-number">
            Certificate #: ${data.certificateNumber}
          </div>
        </div>
        
        <div class="bacb-info">
          This certificate may be used for BACB continuing education documentation purposes.
          <br/>
          Participants are responsible for reporting CEUs to the BACB during their recertification cycle.
        </div>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Prepare certificate data from event and participant info
 */
export function prepareCertificateData(
  event: AceEvent,
  participant: AceUser,
  providerName: string,
  providerNumber?: string,
  options?: {
    aceCoordinator?: string;
    instructorName?: string;
    instructorCredentials?: string;
  }
): CertificateData {
  return {
    certificateNumber: generateCertificateNumber(),
    participantName: `${participant.first_name} ${participant.last_name}`,
    participantEmail: participant.email,
    bacbNumber: participant.bacb_id,
    eventTitle: event.title,
    eventDate: event.start_date,
    instructorName: options?.instructorName || 'Rob Spain, M.S., BCBA, IBA',
    instructorCredentials: options?.instructorCredentials || 'Board Certified Behavior Analyst',
    totalCeus: event.total_ceus,
    ceCategory: event.ce_category.charAt(0).toUpperCase() + event.ce_category.slice(1),
    providerName,
    providerNumber,
    eventModality: formatEventModality(event.modality),
    aceCoordinator: options?.aceCoordinator || 'Rob Spain, M.S., BCBA, IBA',
    issuedDate: new Date().toISOString(),
  };
}

export function formatEventModality(modality?: AceEvent['modality']): string {
  switch (modality) {
    case 'in_person':
      return 'In Person';
    case 'synchronous':
      return 'Online (Live)';
    case 'asynchronous':
      return 'Online (On-Demand)';
    default:
      return 'Not specified';
  }
}

/**
 * Convert HTML to PDF (placeholder - will use browser print or library)
 */
export function downloadCertificatePDF(html: string, filename: string) {
  // Open print dialog with the certificate
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  }
}

/**
 * Preview certificate in new window
 */
export function previewCertificate(html: string) {
  const previewWindow = window.open('', '_blank', 'width=1100,height=850');
  if (previewWindow) {
    previewWindow.document.write(html);
    previewWindow.document.close();
  }
}

import { randomUUID } from 'crypto';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import { getActiveCertificateConfig } from '@/lib/masterclass/admin-queries';
import {
  canGenerateCertificate,
  generateCertificate,
  getCertificateByEnrollment,
  getCertificateById,
  getEnrollmentById,
  markCertificateEmailed,
} from '@/lib/masterclass/queries';
import type { MasterclassCertificate } from '@/lib/masterclass/types';
import type { MasterclassCertificateConfig } from '@/lib/masterclass/admin-types';
import {
  generateMasterclassCertificatePdf,
  type MasterclassCertificateTemplateData,
} from './certificate-generator';

function buildCertificateId(): string {
  const fragment = randomUUID().split('-')[0].toUpperCase();
  return `MC-${new Date().getFullYear()}-${fragment}`;
}

function getSiteBaseUrl(): string {
  return (
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    'https://behaviorschool.com'
  ).replace(/\/$/, '');
}

function buildDownloadPath(certificateId: string): string {
  return `/api/masterclass/certificate/${certificateId}/download`;
}

function buildAbsoluteDownloadUrl(certificateId: string): string {
  return `${getSiteBaseUrl()}${buildDownloadPath(certificateId)}`;
}

function buildTemplateData(
  certificate: MasterclassCertificate,
  config: MasterclassCertificateConfig
): MasterclassCertificateTemplateData {
  return {
    certificateId: certificate.certificate_id,
    recipientName: certificate.recipient_name,
    courseTitle: certificate.course_title,
    completionDate: certificate.completion_date,
    ceuCredits: Number(certificate.ceu_credits),
    bacbCertNumber: certificate.bacb_cert_number,
    providerNumber: config.bacb_provider_number,
    organizationName: config.organization_name,
    organizationWebsite: config.organization_website || undefined,
    certificateSubtitle: config.certificate_subtitle || undefined,
    completionStatement: config.completion_statement,
    signatureName: config.signature_name || undefined,
    signatureTitle: config.signature_title || undefined,
  };
}

async function ensureCertificateRecord(
  enrollmentId: string
): Promise<{
  certificate: MasterclassCertificate;
  config: MasterclassCertificateConfig;
  enrollmentEmailSent: boolean;
}> {
  const enrollment = await getEnrollmentById(enrollmentId);

  if (!enrollment) {
    throw new Error('Enrollment not found');
  }

  if (!enrollment.completed_at) {
    const isComplete = await canGenerateCertificate(enrollmentId);
    if (!isComplete) {
      throw new Error('Course is not completed yet');
    }
  }

  const config = await getActiveCertificateConfig();
  if (!config) {
    throw new Error('Certificate configuration is not set up');
  }

  let certificate = await getCertificateByEnrollment(enrollmentId);

  if (!certificate) {
    try {
      certificate = await generateCertificate(enrollmentId, buildCertificateId(), {
        recipientName: enrollment.name,
        recipientEmail: enrollment.email,
        bacbCertNumber: enrollment.bacb_cert_number,
        courseTitle: config.course_title,
        ceuCredits: Number(config.ceu_credits),
        completionDate: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('duplicate key value')) {
        certificate = await getCertificateByEnrollment(enrollmentId);
      } else {
        throw error;
      }
    }
  }

  if (!certificate) {
    throw new Error('Unable to retrieve certificate record');
  }

  return {
    certificate,
    config,
    enrollmentEmailSent: enrollment.certificate_emailed,
  };
}

async function sendCertificateEmail(
  certificate: MasterclassCertificate,
  downloadUrl: string,
  pdfBuffer: Buffer
): Promise<boolean> {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;
  const fromEmail = process.env.MAILGUN_FROM_EMAIL;

  if (!apiKey || !domain || !fromEmail) {
    console.warn('Mailgun environment variables missing; skipping certificate email');
    return false;
  }

  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({ username: 'api', key: apiKey });

  const subject = `Your CEU Certificate: ${certificate.course_title}`;
  const textBody = `Hi ${certificate.recipient_name},\n\nCongratulations on completing the School BCBA Masterclass. Your CEU certificate is attached and you can download it anytime here: ${downloadUrl}.\n\nKeep doing great work,\nBehavior School`;
  const htmlBody = `
    <p>Hi ${certificate.recipient_name},</p>
    <p>Congratulations on completing the School BCBA Masterclass! Your CEU certificate is attached for your records.</p>
    <p>You can also download it anytime from this link:<br />
      <a href="${downloadUrl}" target="_blank" rel="noopener">${downloadUrl}</a>
    </p>
    <p>Keep doing great work,<br />Behavior School</p>
  `;

  try {
    await mg.messages.create(domain, {
      from: fromEmail,
      to: certificate.recipient_email,
      subject,
      text: textBody,
      html: htmlBody,
      attachment: [
        {
          data: pdfBuffer,
          filename: `BehaviorSchool-${certificate.certificate_id}.pdf`,
          contentType: 'application/pdf',
        },
      ],
    });

    return true;
  } catch (error) {
    console.error('Failed to send certificate email via Mailgun:', error);
    return false;
  }
}

export async function issueCertificateForEnrollment(
  enrollmentId: string
): Promise<{
  certificate: MasterclassCertificate;
  downloadPath: string;
  emailSent: boolean;
}> {
  const { certificate, config, enrollmentEmailSent } = await ensureCertificateRecord(enrollmentId);
  let emailSent = enrollmentEmailSent;

  if (!enrollmentEmailSent) {
    const pdfBytes = await generateMasterclassCertificatePdf(
      buildTemplateData(certificate, config)
    );
    const pdfBuffer = Buffer.from(pdfBytes);
    const downloadUrl = buildAbsoluteDownloadUrl(certificate.certificate_id);
    emailSent = await sendCertificateEmail(certificate, downloadUrl, pdfBuffer);

    if (emailSent) {
      await markCertificateEmailed(enrollmentId);
    }
  }

  return {
    certificate,
    downloadPath: buildDownloadPath(certificate.certificate_id),
    emailSent,
  };
}

export async function getCertificatePdfById(
  certificateId: string
): Promise<{ certificate: MasterclassCertificate; pdfBytes: Uint8Array } | null> {
  const certificate = await getCertificateById(certificateId);

  if (!certificate) {
    return null;
  }

  const config = await getActiveCertificateConfig();
  if (!config) {
    throw new Error('Certificate configuration is not set up');
  }

  const pdfBytes = await generateMasterclassCertificatePdf(
    buildTemplateData(certificate, config)
  );

  return {
    certificate,
    pdfBytes,
  };
}

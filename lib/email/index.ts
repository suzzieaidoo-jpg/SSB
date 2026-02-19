import sgMail from '@sendgrid/mail';

export async function sendDossierEmail(to: string, link: string, attachmentBase64?: string) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');
  await sgMail.send({
    to,
    from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com',
    subject: 'Your Founder Readiness Dossier',
    text: `Your dossier is ready: ${link}`,
    attachments: attachmentBase64 ? [{ content: attachmentBase64, filename: 'founder-readiness-dossier.pdf', type: 'application/pdf', disposition: 'attachment' }] : []
  });
}

import * as SibApiV3Sdk from '@getbrevo/brevo';

// Initialize Brevo API instance
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
// Configure API key authorization
apiInstance.setApiKey(SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

// Interface for email options
export interface EmailOptions {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, any>;
  cc?: { email: string; name?: string }[];
  bcc?: { email: string; name?: string }[];
  replyTo?: { email: string; name?: string };
  tags?: string[];
  attachment?: { name: string; content: string; url?: string }[];
}

/**
 * Sends an email using Brevo API
 * @param options EmailOptions object containing all email parameters
 * @returns Promise with the API response
 */
export async function sendEmail(options: EmailOptions) {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    // Set required parameters
    sendSmtpEmail.to = options.to;
    sendSmtpEmail.subject = options.subject;
    sendSmtpEmail.htmlContent = options.htmlContent;

    // Set optional parameters if provided
    if (options.textContent) sendSmtpEmail.textContent = options.textContent;
    if (options.templateId) sendSmtpEmail.templateId = options.templateId;
    if (options.params) sendSmtpEmail.params = options.params;
    if (options.cc) sendSmtpEmail.cc = options.cc;
    if (options.bcc) sendSmtpEmail.bcc = options.bcc;
    if (options.replyTo) sendSmtpEmail.replyTo = options.replyTo;
    if (options.tags) sendSmtpEmail.tags = options.tags;
    if (options.attachment) sendSmtpEmail.attachment = options.attachment;

    // Set sender (from your Brevo account)
    sendSmtpEmail.sender = {
      name: process.env.EMAIL_FROM_NAME || 'BitnBolt',
      email: process.env.EMAIL_FROM_ADDRESS || 'noreply@bitnbolt.in'
    };

    // Send the email
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
// import { sendEmail } from '@/lib/email';

// await sendEmail({
//   to: [{ email: 'user@example.com', name: 'John Doe' }],
//   subject: 'Welcome to BitnBolt',
//   htmlContent: '<h1>Welcome!</h1><p>Thank you for joining us.</p>',
//   tags: ['welcome']
// });

/**
 * Sends an OTP email
 * @param to Recipient email address
 * @param otp The OTP code
 * @param name Optional recipient name
 */
export async function sendOTPEmail(to: string, otp: string, name?: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Your OTP Code</h2>
      <p>Hello ${name || 'there'},</p>
      <p>Your OTP code is:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; margin: 20px 0;">
        <strong>${otp}</strong>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please ignore this email.</p>
      <p>Best regards,<br>BitnBolt Team</p>
    </div>
  `;

  return sendEmail({
    to: [{ email: to, name }],
    subject: 'Your OTP Code - BitnBolt',
    htmlContent,
    tags: ['otp']
  });
}
// import { sendOTPEmail } from '@/lib/email';

// await sendOTPEmail('user@example.com', '123456', 'John Doe');

/**
 * Sends a verification email with a link
 * @param to Recipient email address
 * @param verificationLink The verification link
 * @param name Optional recipient name
 */
export async function sendVerificationEmail(to: string, verificationLink: string, name?: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Verify Your Email Address</h2>
      <p>Hello ${name || 'there'},</p>
      <p>Please click the button below to verify your email address:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" 
           style="background-color: #0066cc; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
      </div>
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #0066cc;">${verificationLink}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you didn't create an account with us, please ignore this email.</p>
      <p>Best regards,<br>BitnBolt Team</p>
    </div>
  `;

  return sendEmail({
    to: [{ email: to, name }],
    subject: 'Verify Your Email - BitnBolt',
    htmlContent,
    tags: ['verification']
  });
}
// import { sendVerificationEmail } from '@/lib/email';

// await sendVerificationEmail(
//   'user@example.com',
//   'https://bitnbolt.in/verify?token=xyz',
//   'John Doe'
// );
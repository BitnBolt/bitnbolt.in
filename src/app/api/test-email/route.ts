import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendOTPEmail, sendVerificationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Get the email type from query parameter
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'general';
    const toEmail = searchParams.get('email') || 'test@example.com';
    const name = searchParams.get('name') || 'Test User';

    let result;

    switch (type) {
      case 'otp':
        // Generate a random 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        result = await sendOTPEmail(toEmail, otp, name);
        break;

      case 'verification':
        // Create a mock verification link
        const verificationLink = `https://bitnbolt.in/verify?token=${Buffer.from(toEmail).toString('base64')}`;
        result = await sendVerificationEmail(toEmail, verificationLink, name);
        break;

      default:
        // Send a general test email
        result = await sendEmail({
          to: [{ email: toEmail, name }],
          subject: 'Test Email from BitnBolt',
          htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1>Test Email</h1>
              <p>Hello ${name},</p>
              <p>This is a test email sent from the BitnBolt API.</p>
              <p>Email type: ${type}</p>
              <p>Time sent: ${new Date().toLocaleString()}</p>
              <p>Best regards,<br>BitnBolt Team</p>
            </div>
          `,
          tags: ['test']
        });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test ${type} email sent successfully to ${toEmail}`,
        data: result.data
      });
    } else {
      throw result.error;
    }
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to send test email',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
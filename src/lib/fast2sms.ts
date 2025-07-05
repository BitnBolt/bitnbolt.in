interface Fast2SMSResponse {
  return: boolean;
  request_id: string;
  message: string[];
}

export async function sendOTP(phone: string, otp: string): Promise<{ success: boolean; message: string }> {
  try {
    const FAST2SMS_API_KEY = process.env.FAST2SMS_API_KEY;
    
    if (!FAST2SMS_API_KEY) {
      throw new Error('FAST2SMS_API_KEY is not configured');
    }

    const message = `Your BitnBolt vendor verification OTP is: ${otp}. Valid for 10 minutes.`;
    
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': FAST2SMS_API_KEY,
      },
      body: JSON.stringify({
        route: 'otp',
        variables_values: otp,
        numbers: phone,
        flash: 0,
      }),
    });

    if (!response.ok) {
      throw new Error(`Fast2SMS API error: ${response.status}`);
    }

    const data: Fast2SMSResponse = await response.json();

    if (data.return) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      throw new Error(data.message?.join(', ') || 'Failed to send OTP');
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Failed to send OTP' 
    };
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
} 
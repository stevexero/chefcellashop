import { NextResponse } from 'next/server';
import { sendEmail } from '@/app/utils/email';

export async function POST() {
  try {
    await sendEmail({
      to: 'steveanthony999@gmail.com',
      subject: 'Test Email from Chef Cella',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Test Email</h1>
          <p>This is a test email from the Chef Cella website.</p>
          <p>If you're seeing this, the email system is working correctly!</p>
          <p>Sent at: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send test email:', error);
    return NextResponse.json(
      { error: 'Failed to send test email' },
      { status: 500 }
    );
  }
}

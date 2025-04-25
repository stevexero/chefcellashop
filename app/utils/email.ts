import nodemailer from 'nodemailer';

interface EmailOptions {
  user: string;
  from: string;
  pass: string;
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({
  user,
  from,
  pass,
  to,
  subject,
  html,
}: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user,
      pass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  try {
    // Verify SMTP connection configuration
    await transporter.verify();

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

import { Resend } from 'resend';

// Only initialize Resend if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  if (!resend) {
    console.warn('Resend API key not configured. Email not sent.');
    throw new Error('Email service not configured');
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'PERON.ID <noreply@izzudinalqossam.me>',
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send email');
    }

    return data;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
}

export function getPasswordResetEmailTemplate(verificationCode: string, userName?: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .code-box {
          background-color: #f5f5f5;
          border: 2px dashed #333;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin: 30px 0;
        }
        .code {
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 8px;
          color: #000;
          font-family: 'Courier New', monospace;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Kode Verifikasi Reset Kata Sandi - PERON.ID</h2>
        ${userName ? `<p>Halo ${userName},</p>` : '<p>Halo,</p>'}
        <p>Kami menerima permintaan untuk reset kata sandi akun Anda di PERON.ID.</p>
        <p>Gunakan kode verifikasi berikut untuk reset kata sandi Anda:</p>
        <div class="code-box">
          <div class="code">${verificationCode}</div>
        </div>
        <p><strong>Kode ini akan kadaluarsa dalam 1 jam.</strong></p>
        <p>Masukkan kode ini di halaman reset kata sandi untuk melanjutkan.</p>
        <p>Jika Anda tidak meminta reset kata sandi, abaikan email ini. Kata sandi Anda tidak akan berubah.</p>
        <div class="footer">
          <p>Email ini dikirim oleh PERON.ID</p>
          <p>Jangan balas email ini. Email ini dikirim secara otomatis.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

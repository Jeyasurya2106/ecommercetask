import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;
let usingEthereal = false;

async function createTransporter() {
  const host = process.env.SMTP_HOST;
  if (host && host !== 'smtp.example.com') {
    try {
      const temp = nodemailer.createTransport({
        host,
        port: Number(process.env.SMTP_PORT || 587),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      // verify credentials — will throw if auth fails
      await temp.verify();
      transporter = temp;
      usingEthereal = false;
      console.log('SMTP transporter ready using configured SMTP host.');
      return;
    } catch (err) {
      console.warn('Configured SMTP failed verification — will fallback to Ethereal for dev. Error:', err.message);
      transporter = null; 
    }
  }

  const testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: { user: testAccount.user, pass: testAccount.pass }
  });
  usingEthereal = true;
  console.log('Using Ethereal SMTP for dev. Preview emails will be logged.');
  console.log('Ethereal account user:', testAccount.user);
}

await createTransporter();

export async function sendEmail({ to, subject, html, text }) {
  if (!transporter) await createTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || (usingEthereal ? 'no-reply@ethereal.email' : process.env.SMTP_USER || 'no-reply@example.com'),
      to,
      subject,
      html,
      text
    });

    if (usingEthereal) {
      const preview = nodemailer.getTestMessageUrl(info);
      console.log('Ethereal preview URL:', preview);
    }
    return info;
  } catch (err) {
    console.error('sendEmail error', err.message || err);
    throw err;
  }
}

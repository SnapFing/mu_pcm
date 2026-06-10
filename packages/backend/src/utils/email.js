// packages/backend/src/utils/email.js
// Requires: npm install nodemailer  (in packages/backend)
// Env vars needed:
//   EMAIL_USER  — your Gmail address e.g. mulungushisdapcmpublicity@gmail.com
//   EMAIL_PASS  — Gmail App Password (NOT your normal password)
//
// How to get a Gmail App Password:
//   1. Enable 2-Step Verification on the Gmail account
//   2. Go to myaccount.google.com → Security → App Passwords
//   3. Create one named "MU PCM Backend"
//   4. Paste the 16-char code as EMAIL_PASS in Vercel env vars

const nodemailer = require('nodemailer');

function getTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  if (!user || !pass) return null;

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

/**
 * sendEmail({ to, subject, html, replyTo })
 * Fire-and-forget — logs warning if env vars are missing, never throws.
 */
async function sendEmail({ to, subject, html, replyTo }) {
  const transporter = getTransporter();

  if (!transporter) {
    console.warn('[email] EMAIL_USER or EMAIL_PASS not set — notification skipped');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"MU SDA PCM" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      replyTo: replyTo || undefined,
    });
    console.log(`[email] Sent: "${subject}" → ${to}`);
  } catch (err) {
    // Log but don't let an email failure break the API response
    console.error('[email] Send failed:', err.message);
  }
}

module.exports = { sendEmail };
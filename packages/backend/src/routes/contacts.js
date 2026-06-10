// packages/backend/src/routes/contacts.js
const express = require('express');
const router  = express.Router();
const { db }  = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');
const { publicSubmitLimiter }      = require('../middleware/rateLimit');
const { sendEmail }                = require('../utils/email');

const COL     = 'contacts';
const NOTIFY  = process.env.NOTIFY_EMAIL || process.env.EMAIL_USER || 'mulungushisdapcmpublicity@gmail.com';

// ── Public — anyone can submit ─────────────────────────────────────────────
router.post('/', publicSubmitLimiter, async (req, res) => {
  try {
    const { name, email, subject, message, date } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name is required.' });
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid email address is required.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return res.status(400).json({ error: 'Message must be at least 5 characters.' });
    }

    const doc = await db.collection(COL).add({
      name:        name.trim().slice(0, 120),
      email:       email.trim().slice(0, 160),
      subject:     typeof subject === 'string' ? subject.trim().slice(0, 160) : '',
      message:     message.trim().slice(0, 3000),
      date:        date || new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      status:      'Unread',
    });

    // ── Email notification (fire-and-forget) ───────────────────────────────
    sendEmail({
      to:      NOTIFY,
      subject: `📬 New Contact Message: ${subject || '(no subject)'}`,
      replyTo: email,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f7;border-radius:8px;">
          <div style="background:#0F2A4A;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
            <h2 style="color:white;margin:0;font-size:16px;">MU SDA PCM — New Contact Message</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:#64748B;width:80px;">From</td><td style="padding:6px 0;font-weight:600;color:#0F2A4A;">${name.trim()}</td></tr>
            <tr><td style="padding:6px 0;color:#64748B;">Email</td><td style="padding:6px 0;"><a href="mailto:${email}" style="color:#2E6DE7;">${email}</a></td></tr>
            <tr><td style="padding:6px 0;color:#64748B;">Subject</td><td style="padding:6px 0;color:#0F2A4A;">${subject || '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#64748B;">Date</td><td style="padding:6px 0;color:#64748B;">${date || new Date().toISOString().split('T')[0]}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
          <p style="font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${message.trim()}</p>
          <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
          <p style="font-size:12px;color:#94A3B8;">Reply directly to this email to respond to ${name.trim()}.</p>
          <p style="font-size:12px;color:#94A3B8;">View in admin: <a href="https://mupcm.vercel.app/admin-portal" style="color:#2E6DE7;">Admin Portal → Contact Inbox</a></p>
        </div>
      `,
    });

    res.status(201).json({ id: doc.id, message: 'Message received!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin+ — view inbox ────────────────────────────────────────────────────
router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const snap = await db.collection(COL).orderBy('submittedAt', 'desc').limit(200).get();
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).update({
      ...req.body,
      updatedAt:  new Date().toISOString(),
      updatedBy:  req.user.uid,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    await db.collection(COL).doc(req.params.id).delete();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

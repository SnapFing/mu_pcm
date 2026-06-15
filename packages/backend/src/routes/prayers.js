// packages/backend/src/routes/prayers.js
const express = require('express');
const router  = express.Router();
const { db }  = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');
const { publicSubmitLimiter }      = require('../middleware/rateLimit');
const { sendEmail }                = require('../utils/email');

const COL = 'prayers';

// "Whoever is in charge of prayer requests" — override with PRAYER_TEAM_EMAIL,
// otherwise falls back to the existing NOTIFY/EMAIL_USER chain.
const NOTIFY =
  process.env.PRAYER_TEAM_EMAIL ||
  process.env.NOTIFY_EMAIL ||
  process.env.EMAIL_USER ||
  'mulungushisdapcmpublicity@gmail.com';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── Public — anyone can submit, rate-limited ───────────────────────────────
router.post('/', publicSubmitLimiter, async (req, res) => {
  try {
    const { name, email, category, request, anonymous, date } = req.body;

    if (!request || typeof request !== 'string' || request.trim().length < 5) {
      return res.status(400).json({ error: 'Prayer request must be at least 5 characters.' });
    }

    const isAnon = !!anonymous;

    if (!isAnon && email && (typeof email !== 'string' || !EMAIL_RE.test(email.trim()))) {
      return res.status(400).json({ error: 'Please enter a valid email address, or leave it blank.' });
    }

    const displayName = isAnon ? 'Anonymous' : (name || 'Anonymous');
    const cleanEmail  = (!isAnon && typeof email === 'string') ? email.trim().slice(0, 160) : '';

    const doc = await db.collection(COL).add({
      name:        displayName,
      email:       cleanEmail,
      category:    category || 'General',
      request:     request.trim().slice(0, 2000),
      anonymous:   isAnon,
      date:        date || new Date().toISOString().split('T')[0],
      submittedAt: new Date().toISOString(),
      status:      'Unread',
    });

    // ── Notify the prayer team (receiver) ───────────────────────────────────
    sendEmail({
      to:      NOTIFY,
      subject: `🙏 New Prayer Request — ${category || 'General'}`,
      replyTo: cleanEmail || undefined,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f7;border-radius:8px;">
          <div style="background:#0F2A4A;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
            <h2 style="color:white;margin:0;font-size:16px;">MU SDA PCM — New Prayer Request</h2>
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:6px 0;color:#64748B;width:80px;">From</td><td style="padding:6px 0;font-weight:600;color:#0F2A4A;">${displayName}</td></tr>
            ${cleanEmail ? `<tr><td style="padding:6px 0;color:#64748B;">Email</td><td style="padding:6px 0;"><a href="mailto:${cleanEmail}" style="color:#2E6DE7;">${cleanEmail}</a></td></tr>` : ''}
            <tr><td style="padding:6px 0;color:#64748B;">Category</td><td style="padding:6px 0;"><span style="background:rgba(46,109,231,0.1);color:#2E6DE7;padding:2px 10px;border-radius:20px;font-size:12px;font-weight:600;">${category || 'General'}</span></td></tr>
            <tr><td style="padding:6px 0;color:#64748B;">Date</td><td style="padding:6px 0;color:#64748B;">${date || new Date().toISOString().split('T')[0]}</td></tr>
          </table>
          <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
          <div style="background:#F5F7FF;border-left:3px solid #2E6DE7;padding:16px;border-radius:0 6px 6px 0;">
            <p style="font-size:14px;color:#334155;line-height:1.75;margin:0;white-space:pre-wrap;">${request.trim()}</p>
          </div>
          <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
          <p style="font-size:12px;color:#94A3B8;">View and manage in: <a href="https://mupcm.vercel.app/admin-portal" style="color:#2E6DE7;">Admin Portal → Prayer Requests</a></p>
          <p style="font-size:12px;color:#94A3B8;font-style:italic;">"The prayer of a righteous person is powerful and effective." — James 5:16</p>
        </div>
      `,
    });

    // ── Confirm receipt with the requester (sender), if they shared an email ─
    if (cleanEmail) {
      sendEmail({
        to:      cleanEmail,
        subject: '🙏 Your prayer request has been received — MU SDA PCM',
        replyTo: NOTIFY,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f7;border-radius:8px;">
            <div style="background:#0F2A4A;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
              <h2 style="color:white;margin:0;font-size:16px;">MU SDA PCM Prayer Team</h2>
            </div>
            <p style="font-size:14px;color:#334155;line-height:1.7;">Dear ${displayName === 'Anonymous' ? 'friend' : displayName},</p>
            <p style="font-size:14px;color:#334155;line-height:1.7;">
              Thank you for sharing your prayer request with us. Our prayer team has received it and will be lifting it up in prayer.
            </p>
            <div style="background:#F5F7FF;border-left:3px solid #2E6DE7;padding:16px;border-radius:0 6px 6px 0;margin:16px 0;">
              <p style="font-size:14px;color:#334155;line-height:1.75;margin:0;white-space:pre-wrap;">${request.trim()}</p>
            </div>
            <p style="font-size:14px;color:#334155;line-height:1.7;">You are not alone — we are praying with and for you.</p>
            <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
            <p style="font-size:12px;color:#94A3B8;font-style:italic;">"The prayer of a righteous person is powerful and effective." — James 5:16</p>
            <p style="font-size:12px;color:#94A3B8;margin-top:16px;">MU SDA PCM &middot; Mulungushi University, Kabwe, Zambia</p>
          </div>
        `,
      });
    }

    res.status(201).json({ id: doc.id, message: 'Prayer request received' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin+ — prayer inbox ──────────────────────────────────────────────────
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
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.uid,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Admin+ — email a reply back to the requester ────────────────────────────
router.post('/:id/reply', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length < 2) {
      return res.status(400).json({ error: 'Reply message is required.' });
    }

    const ref = db.collection(COL).doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ error: 'Prayer request not found' });

    const data = doc.data();
    if (!data.email) {
      return res.status(400).json({ error: 'This requester did not share an email address.' });
    }

    const trimmed = message.trim().slice(0, 2000);

    await sendEmail({
      to:      data.email,
      subject: 'A message from the MU SDA PCM Prayer Team',
      replyTo: NOTIFY,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f7;border-radius:8px;">
          <div style="background:#0F2A4A;padding:16px 24px;border-radius:6px 6px 0 0;margin:-24px -24px 24px;">
            <h2 style="color:white;margin:0;font-size:16px;">MU SDA PCM Prayer Team</h2>
          </div>
          <p style="font-size:14px;color:#334155;line-height:1.7;">Dear ${data.name === 'Anonymous' ? 'friend' : data.name},</p>
          <p style="font-size:14px;color:#334155;line-height:1.7;white-space:pre-wrap;">${trimmed}</p>
          <hr style="border:none;border-top:1px solid #E2E8F7;margin:16px 0;">
          <p style="font-size:12px;color:#94A3B8;">Regarding your prayer request submitted on ${data.date || ''}:</p>
          <div style="background:#F5F7FF;border-left:3px solid #2E6DE7;padding:12px 16px;border-radius:0 6px 6px 0;margin:8px 0;">
            <p style="font-size:13px;color:#64748B;line-height:1.7;margin:0;white-space:pre-wrap;">${(data.request || '').trim()}</p>
          </div>
          <p style="font-size:12px;color:#94A3B8;font-style:italic;margin-top:16px;">"The prayer of a righteous person is powerful and effective." — James 5:16</p>
        </div>
      `,
    });

    await ref.update({
      status:    'Replied',
      lastReply: trimmed,
      repliedAt: new Date().toISOString(),
      repliedBy: req.user.uid,
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
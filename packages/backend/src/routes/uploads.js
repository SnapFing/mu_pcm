const express = require('express');
const router = express.Router();
const { admin } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

let multer;
try { multer = require('multer'); } catch (err) { multer = null; }

if (!multer) {
  console.warn('Multer is not installed. File uploads are disabled.');
  router.post('/', verifyToken, requireRole('editor'), async (req, res) => {
    res.status(501).json({ error: 'File uploads not configured on server.' });
  });
} else {
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

  // POST /api/uploads
  router.post('/', verifyToken, requireRole('editor'), upload.single('file'), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const bucket = admin.storage().bucket();
      const name = `uploads/${Date.now()}_${req.file.originalname.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
      const file = bucket.file(name);

      await file.save(req.file.buffer, { metadata: { contentType: req.file.mimetype } });
      // Make public (optional). If your bucket requires signed urls, adjust accordingly.
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${encodeURIComponent(name)}`;
      res.json({ url: publicUrl });
    } catch (err) {
      console.error('[uploads] error:', err);
      res.status(500).json({ error: err.message || 'Upload failed' });
    }
  });
}

module.exports = router;

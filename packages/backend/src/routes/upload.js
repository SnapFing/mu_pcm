const express = require('express');
const router = express.Router();
const multer = require('multer');
const { admin } = require('../firebase');
const { verifyToken, requireRole } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// POST /api/upload/image
router.post(
  '/image',
  verifyToken,
  requireRole('editor'),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

      const bucket = admin.storage().bucket(); // uses default bucket
      const fileName = `events/${Date.now()}-${req.file.originalname}`;
      const file = bucket.file(fileName);

      await file.save(req.file.buffer, {
        contentType: req.file.mimetype,
        public: true,
      });

      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;
      res.json({ url: publicUrl });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
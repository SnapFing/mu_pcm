const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { verifyToken, requireRole } = require('../middleware/auth');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/', verifyToken, requireRole('editor'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Upload to Cloudinary (auto-detect resource type)
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'mu-pcm-uploads',
      resource_type: 'auto',
    });

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('[uploads] error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
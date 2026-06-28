const express  = require('express');
const router   = express.Router();
const multer   = require('multer');
const cloudinary = require('cloudinary').v2;
const path     = require('path');
const { verifyToken, requireRole } = require('../middleware/auth');

// ── Guard: log clearly if env vars are missing ────────────────────────────
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('[uploads] ⚠️  One or more Cloudinary env vars are missing. Uploads will fail.');
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Allowed MIME types ────────────────────────────────────────────────────
const ALLOWED_MIMES = new Set([
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',       // .xlsx
  'application/msword',                                                       // .doc
  'application/vnd.ms-excel',                                                 // .xls
  'video/mp4', 'video/webm', 'video/ogg',
]);

// Map MIME → Cloudinary resource_type
function getResourceType(mimetype) {
  if (mimetype.startsWith('image/'))  return 'image';
  if (mimetype.startsWith('video/'))  return 'video';
  return 'raw'; // PDFs, Office docs
}

// Map MIME → file extension (needed so Cloudinary raw files get a proper URL)
const MIME_TO_EXT = {
  'application/pdf': 'pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
  'application/msword':     'doc',
  'application/vnd.ms-excel': 'xls',
  'video/mp4':  'mp4',
  'video/webm': 'webm',
  'video/ogg':  'ogv',
};

const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: 10 * 1024 * 1024 }, // 10 MB (was 5 MB — videos need more room)
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIMES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type not allowed: ${file.mimetype}`), false);
    }
  },
});

router.post(
  '/',
  verifyToken,
  requireRole('editor'),
  upload.single('file'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { mimetype, buffer, originalname } = req.file;
      const resource_type = getResourceType(mimetype);

      // Build upload options
      const uploadOptions = {
        folder:        'mu-pcm-uploads',
        resource_type,
        // Use the original filename stem (without extension) as the public_id
        // so the URL is human-readable and predictable.
        public_id: path
          .basename(originalname, path.extname(originalname))
          .replace(/[^a-zA-Z0-9_-]/g, '_')
          .slice(0, 60),
        unique_filename: true,   // avoids collision if same stem is uploaded twice
        overwrite:       false,
      };

      // For raw files (PDFs, Office docs), we MUST supply the format so
      // Cloudinary appends the right extension to the secure_url.
      // Without this, raw uploads get a URL like /v123/file (no extension)
      // and browsers cannot determine the content-type.
      if (resource_type === 'raw') {
        const ext = MIME_TO_EXT[mimetype];
        if (ext) uploadOptions.format = ext;
      }

      // Upload from buffer — use upload_stream instead of base64 string
      // to avoid the 8/3 size amplification and SDK v2 data-URI edge cases.
      const secure_url = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (err, result) => {
            if (err) return reject(err);
            resolve(result.secure_url);
          }
        );
        stream.end(buffer);
      });

      console.log('[uploads] ✅ uploaded:', secure_url);
      res.json({ url: secure_url });

    } catch (err) {
      console.error('[uploads] ❌ error:', err);
      res.status(500).json({ error: err.message || 'Upload failed' });
    }
  }
);

module.exports = router;
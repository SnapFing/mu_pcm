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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/msword', // .doc
      'application/vnd.ms-excel', // .xls
      'video/mp4',
      'video/webm',
      'video/ogg',
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'), false);
    }
  },
});

router.post('/', verifyToken, requireRole('editor'), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    // Convert buffer to base64 data URI
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    // Determine if the file is an image – all other types will be treated as 'raw'
    const isImage = req.file.mimetype.startsWith('image/');

    const uploadOptions = {
      folder: 'mu-pcm-uploads',
      resource_type: isImage ? 'image' : 'raw',   // PDFs, DOCXs etc. must be 'raw'
    };

    // For PDFs we can force the public format to pdf, but it's optional.
    // Cloudinary will still serve it correctly if resource_type is 'raw'.
    if (req.file.mimetype === 'application/pdf') {
      uploadOptions.format = 'pdf';
    }

    const result = await cloudinary.uploader.upload(dataURI, uploadOptions);

    res.json({ url: result.secure_url });
  } catch (err) {
    console.error('[uploads] error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

module.exports = router;
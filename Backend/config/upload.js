import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/events';

mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${randomUUID()}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format non autorisé. Utilisez JPG, PNG ou WebP.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

export function runUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.array('images', 5)(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

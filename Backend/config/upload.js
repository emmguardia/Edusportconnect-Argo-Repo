import multer from 'multer';

/*
 * Images d'événements stockées dans MariaDB (Galera) et non sur disque :
 * le backend n'a plus de volume local et peut tourner sur n'importe quel
 * nœud du cluster. Les fichiers restent en mémoire le temps de la requête
 * (5 × 5 Mo maximum), puis sont écrits en base.
 */

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_IMAGES = 5;

function fileFilter(_req, file, cb) {
  if (ALLOWED_MIME.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format non autorisé. Utilisez JPG, PNG ou WebP.'));
  }
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: MAX_SIZE_BYTES },
});

export function runUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload.array('images', MAX_IMAGES)(req, res, (err) => {
      if (err?.code === 'LIMIT_FILE_SIZE') reject(new Error('Image trop lourde : 5 Mo maximum par image.'));
      else if (err?.code === 'LIMIT_UNEXPECTED_FILE') reject(new Error(`Maximum ${MAX_IMAGES} images.`));
      else if (err) reject(err);
      else resolve();
    });
  });
}

/**
 * Type réel d'après les premiers octets (le mimetype envoyé par le navigateur
 * est déclaratif). Le Content-Type servi ensuite vient d'ici, jamais du client.
 * @returns {'image/jpeg'|'image/png'|'image/webp'|null}
 */
export function detectImageMime(buf) {
  if (!buf || buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'image/jpeg';
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'image/png';
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'image/webp';
  return null;
}

/** Vérifie tous les fichiers ; renvoie un message d'erreur ou null. */
export function checkImages(files = []) {
  for (const f of files) {
    f.detectedMime = detectImageMime(f.buffer);
    if (!f.detectedMime) return `« ${f.originalname} » n'est pas une image JPG, PNG ou WebP valide.`;
  }
  return null;
}

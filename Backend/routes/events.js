import { Router } from 'express';
import { getPool } from '../config/database.js';

const router = Router();

/* ── GET /api/events ────────────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  const pool = getPool();
  const [events] = await pool.execute(`
    SELECT id, title, slug, description, organizer, date_start, date_end, location, created_at
    FROM event WHERE published = 1 ORDER BY date_start ASC
  `);
  const [images] = await pool.execute(
    'SELECT event_id, url, position FROM event_images ORDER BY position ASC'
  );
  const imagesByEvent = {};
  for (const img of images) {
    if (!imagesByEvent[img.event_id]) imagesByEvent[img.event_id] = [];
    imagesByEvent[img.event_id].push(img.url);
  }
  res.json({ events: events.map(e => ({ ...e, images: imagesByEvent[e.id] ?? [] })) });
});

/* ── GET /api/events/images/:key — image stockée en base ────────────────
 * Clé UUID non devinable (même principe que les anciens fichiers /uploads).
 * Contenu immuable pour une clé donnée → cache navigateur/Cloudflare 1 an. */
const KEY_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;

router.get('/images/:key', async (req, res) => {
  if (!KEY_RE.test(req.params.key)) return res.status(404).json({ error: 'Image introuvable' });
  const [rows] = await getPool().execute(
    'SELECT mime, data FROM event_images WHERE file_key = ? LIMIT 1',
    [req.params.key]
  );
  if (!rows.length || !rows[0].data) return res.status(404).json({ error: 'Image introuvable' });

  res.set({
    'Content-Type': rows[0].mime,
    'Content-Length': rows[0].data.length,
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
    'Content-Disposition': 'inline',
  });
  res.end(rows[0].data);
});

/* ── GET /api/events/:slug ──────────────────────────────────────────── */
router.get('/:slug', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, title, slug, description, organizer, date_start, date_end, location, created_at FROM event WHERE slug = ? AND published = 1 LIMIT 1',
    [req.params.slug]
  );
  if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });

  const [images] = await pool.execute(
    'SELECT url FROM event_images WHERE event_id = ? ORDER BY position ASC',
    [rows[0].id]
  );
  res.json({ event: { ...rows[0], images: images.map(i => i.url) } });
});

export default router;

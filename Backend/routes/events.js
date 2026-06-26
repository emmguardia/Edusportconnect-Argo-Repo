import { Router } from 'express';
import { getPool } from '../config/database.js';

const router = Router();

/* ── GET /api/events — liste publique (publiés uniquement) ──────────── */
router.get('/', async (_req, res) => {
  const [rows] = await getPool().execute(`
    SELECT id, title, slug, description, date_start, date_end,
           location, image_url, created_at
    FROM event
    WHERE published = 1
    ORDER BY date_start ASC
  `);
  res.json({ events: rows });
});

/* ── GET /api/events/:slug — détail public ──────────────────────────── */
router.get('/:slug', async (req, res) => {
  const [rows] = await getPool().execute(`
    SELECT id, title, slug, description, date_start, date_end,
           location, image_url, created_at
    FROM event
    WHERE slug = ? AND published = 1
    LIMIT 1
  `, [req.params.slug]);

  if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });
  res.json({ event: rows[0] });
});

export default router;

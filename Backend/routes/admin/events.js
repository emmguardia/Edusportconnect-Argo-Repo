/**
 * GET    /api/admin/events          → tous les événements (publiés + brouillons)
 * GET    /api/admin/events/:id      → détail
 * POST   /api/admin/events          → créer (+ upload image)
 * PUT    /api/admin/events/:id      → modifier (+ remplacer image)
 * DELETE /api/admin/events/:id      → supprimer
 * PATCH  /api/admin/events/:id/publish → toggle publié/brouillon
 */
import { Router } from 'express';
import { z } from 'zod';
import slugify from 'slugify';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import path from 'path';
import { getPool } from '../../config/database.js';
import { requireAdmin } from '../../middleware/auth.js';
import { uploadEvent } from '../../config/upload.js';

const router = Router();
router.use(requireAdmin);

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/events';

const eventSchema = z.object({
  title:       z.string().min(2).max(255).trim(),
  description: z.string().max(5000).trim().optional(),
  date_start:  z.string().datetime({ offset: true }),
  date_end:    z.string().datetime({ offset: true }).optional().nullable(),
  location:    z.string().max(255).trim().optional().nullable(),
  published:   z.coerce.boolean().optional(),
});

function buildSlug(title) {
  return slugify(title, { lower: true, strict: true, locale: 'fr' });
}

async function uniqueSlug(pool, title, excludeId = null) {
  let base = buildSlug(title);
  let slug = base;
  let i = 2;
  while (true) {
    const [rows] = await pool.execute(
      'SELECT id FROM event WHERE slug = ?' + (excludeId ? ' AND id != ?' : ''),
      excludeId ? [slug, excludeId] : [slug]
    );
    if (!rows.length) return slug;
    slug = `${base}-${i++}`;
  }
}

async function deleteImageFile(imageUrl) {
  if (!imageUrl) return;
  try {
    const filename = path.basename(imageUrl);
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // ignore si le fichier n'existe plus
  }
}

/* ── GET /api/admin/events ──────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  const [rows] = await getPool().execute(`
    SELECT id, title, slug, date_start, date_end, location,
           image_url, published, created_at, updated_at
    FROM event
    ORDER BY date_start DESC
  `);
  res.json({ events: rows });
});

/* ── GET /api/admin/events/:id ──────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  const [rows] = await getPool().execute(
    'SELECT * FROM event WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });
  res.json({ event: rows[0] });
});

/* ── POST /api/admin/events ─────────────────────────────────────────── */
router.post('/', (req, res) => {
  uploadEvent(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      if (req.file) await deleteImageFile(`/${req.file.filename}`);
      return res.status(400).json({
        error: 'Données invalides',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { title, description, date_start, date_end, location, published } = parsed.data;
    const pool     = getPool();
    const id       = randomUUID();
    const slug     = await uniqueSlug(pool, title);
    const imageUrl = req.file ? `/uploads/events/${req.file.filename}` : null;

    await pool.execute(
      `INSERT INTO event (id, title, slug, description, date_start, date_end, location, image_url, published, author_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, slug, description ?? null, date_start, date_end ?? null,
       location ?? null, imageUrl, published ? 1 : 0, req.admin.id]
    );

    const [rows] = await pool.execute('SELECT * FROM event WHERE id = ?', [id]);
    res.status(201).json({ event: rows[0] });
  });
});

/* ── PUT /api/admin/events/:id ──────────────────────────────────────── */
router.put('/:id', (req, res) => {
  uploadEvent(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const pool = getPool();
    const [existing] = await pool.execute(
      'SELECT * FROM event WHERE id = ? LIMIT 1',
      [req.params.id]
    );
    if (!existing.length) {
      if (req.file) await deleteImageFile(`/${req.file.filename}`);
      return res.status(404).json({ error: 'Événement introuvable' });
    }

    const parsed = eventSchema.safeParse(req.body);
    if (!parsed.success) {
      if (req.file) await deleteImageFile(`/${req.file.filename}`);
      return res.status(400).json({
        error: 'Données invalides',
        details: parsed.error.flatten().fieldErrors,
      });
    }

    const { title, description, date_start, date_end, location, published } = parsed.data;
    const old = existing[0];

    let imageUrl = old.image_url;
    if (req.file) {
      await deleteImageFile(old.image_url);
      imageUrl = `/uploads/events/${req.file.filename}`;
    }

    // Re-slug seulement si le titre change
    const slug = title !== old.title
      ? await uniqueSlug(pool, title, req.params.id)
      : old.slug;

    await pool.execute(
      `UPDATE event
       SET title = ?, slug = ?, description = ?, date_start = ?, date_end = ?,
           location = ?, image_url = ?, published = ?, updated_at = NOW(3)
       WHERE id = ?`,
      [title, slug, description ?? null, date_start, date_end ?? null,
       location ?? null, imageUrl, published ? 1 : 0, req.params.id]
    );

    const [rows] = await pool.execute('SELECT * FROM event WHERE id = ?', [req.params.id]);
    res.json({ event: rows[0] });
  });
});

/* ── DELETE /api/admin/events/:id ───────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT image_url FROM event WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });

  await deleteImageFile(rows[0].image_url);
  await pool.execute('DELETE FROM event WHERE id = ?', [req.params.id]);
  res.json({ message: 'Événement supprimé' });
});

/* ── PATCH /api/admin/events/:id/publish ────────────────────────────── */
router.patch('/:id/publish', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id, published FROM event WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });

  const newState = rows[0].published ? 0 : 1;
  await pool.execute(
    'UPDATE event SET published = ?, updated_at = NOW(3) WHERE id = ?',
    [newState, req.params.id]
  );
  res.json({ published: !!newState });
});

export default router;

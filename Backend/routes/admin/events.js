import { Router } from 'express';
import { z } from 'zod';
import slugify from 'slugify';
import { randomUUID } from 'crypto';
import { unlink } from 'fs/promises';
import path from 'path';
import { getPool } from '../../config/database.js';
import { requireAdmin } from '../../middleware/auth.js';
import { runUpload } from '../../config/upload.js';

const router = Router();
router.use(requireAdmin);

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads/events';

const eventSchema = z.object({
  title:       z.string().min(2).max(255).trim(),
  description: z.string().max(5000).trim().optional(),
  organizer:   z.string().max(255).trim().optional().nullable(),
  date_start:  z.string().datetime({ offset: true }),
  date_end:    z.string().datetime({ offset: true }).optional().nullable(),
  location:    z.string().max(255).trim().optional().nullable(),
  published:   z.coerce.boolean().optional(),
  keep_images: z.string().optional(), // JSON array of image ids to keep on PUT
});

const toMysql = (iso) => iso ? iso.replace('T', ' ').slice(0, 19) : null;

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

async function deleteFile(filename) {
  if (!filename) return;
  try {
    await unlink(path.join(UPLOAD_DIR, path.basename(filename)));
  } catch { /* ignore */ }
}

async function getEventWithImages(pool, id) {
  const [events] = await pool.execute('SELECT * FROM event WHERE id = ? LIMIT 1', [id]);
  if (!events.length) return null;
  const [images] = await pool.execute(
    'SELECT id, url, position FROM event_images WHERE event_id = ? ORDER BY position ASC',
    [id]
  );
  return { ...events[0], images };
}

/* ── GET /api/admin/events ──────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  const pool = getPool();
  const [events] = await pool.execute(`
    SELECT id, title, slug, organizer, date_start, date_end, location, published, created_at, updated_at
    FROM event ORDER BY date_start DESC
  `);
  const [images] = await pool.execute(
    'SELECT id, event_id, url, position FROM event_images ORDER BY position ASC'
  );
  const imagesByEvent = {};
  for (const img of images) {
    if (!imagesByEvent[img.event_id]) imagesByEvent[img.event_id] = [];
    imagesByEvent[img.event_id].push(img);
  }
  res.json({ events: events.map(e => ({ ...e, images: imagesByEvent[e.id] ?? [] })) });
});

/* ── GET /api/admin/events/:id ──────────────────────────────────────── */
router.get('/:id', async (req, res) => {
  const event = await getEventWithImages(getPool(), req.params.id);
  if (!event) return res.status(404).json({ error: 'Événement introuvable' });
  res.json({ event });
});

/* ── POST /api/admin/events ─────────────────────────────────────────── */
router.post('/', async (req, res) => {
  try { await runUpload(req, res); } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    for (const f of req.files ?? []) await deleteFile(f.filename);
    return res.status(400).json({ error: 'Données invalides', details: parsed.error.flatten().fieldErrors });
  }

  if (!req.files?.length) {
    return res.status(400).json({ error: 'Au moins une image est requise.' });
  }

  const { title, description, organizer, date_start, date_end, location, published } = parsed.data;
  const pool = getPool();
  const id   = randomUUID();
  const slug = await uniqueSlug(pool, title);

  await pool.execute(
    `INSERT INTO event (id, title, slug, description, organizer, date_start, date_end, location, published, author_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, title, slug, description ?? null, organizer ?? null,
     toMysql(date_start), toMysql(date_end), location ?? null, published ? 1 : 0, req.admin.id]
  );

  for (let i = 0; i < req.files.length; i++) {
    await pool.execute(
      'INSERT INTO event_images (event_id, url, position) VALUES (?, ?, ?)',
      [id, `/uploads/events/${req.files[i].filename}`, i]
    );
  }

  const event = await getEventWithImages(pool, id);
  res.status(201).json({ event });
});

/* ── PUT /api/admin/events/:id ──────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  try { await runUpload(req, res); } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const pool = getPool();
  const existing = await getEventWithImages(pool, req.params.id);
  if (!existing) {
    for (const f of req.files ?? []) await deleteFile(f.filename);
    return res.status(404).json({ error: 'Événement introuvable' });
  }

  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    for (const f of req.files ?? []) await deleteFile(f.filename);
    return res.status(400).json({ error: 'Données invalides', details: parsed.error.flatten().fieldErrors });
  }

  // Images à conserver (ids envoyés par le client)
  const keepIds = parsed.data.keep_images
    ? JSON.parse(parsed.data.keep_images).map(Number)
    : existing.images.map(i => i.id);

  // Supprimer les images non conservées
  for (const img of existing.images) {
    if (!keepIds.includes(img.id)) {
      await pool.execute('DELETE FROM event_images WHERE id = ?', [img.id]);
      await deleteFile(img.url);
    }
  }

  const keptCount = keepIds.filter(id => existing.images.some(i => i.id === id)).length;
  const totalAfter = keptCount + (req.files?.length ?? 0);
  if (totalAfter < 1) {
    for (const f of req.files ?? []) await deleteFile(f.filename);
    return res.status(400).json({ error: 'Au moins une image est requise.' });
  }
  if (totalAfter > 5) {
    for (const f of req.files ?? []) await deleteFile(f.filename);
    return res.status(400).json({ error: 'Maximum 5 images.' });
  }

  const { title, description, organizer, date_start, date_end, location, published } = parsed.data;
  const slug = title !== existing.title ? await uniqueSlug(pool, title, req.params.id) : existing.slug;

  await pool.execute(
    `UPDATE event SET title=?, slug=?, description=?, organizer=?, date_start=?, date_end=?,
     location=?, published=?, updated_at=NOW(3) WHERE id=?`,
    [title, slug, description ?? null, organizer ?? null,
     toMysql(date_start), toMysql(date_end), location ?? null, published ? 1 : 0, req.params.id]
  );

  // Renuméroter les images conservées
  let pos = 0;
  for (const id of keepIds) {
    if (existing.images.some(i => i.id === id)) {
      await pool.execute('UPDATE event_images SET position=? WHERE id=?', [pos++, id]);
    }
  }
  // Ajouter les nouvelles
  for (const f of req.files ?? []) {
    await pool.execute(
      'INSERT INTO event_images (event_id, url, position) VALUES (?, ?, ?)',
      [req.params.id, `/uploads/events/${f.filename}`, pos++]
    );
  }

  const event = await getEventWithImages(pool, req.params.id);
  res.json({ event });
});

/* ── DELETE /api/admin/events/:id ───────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  const pool = getPool();
  const existing = await getEventWithImages(pool, req.params.id);
  if (!existing) return res.status(404).json({ error: 'Événement introuvable' });

  for (const img of existing.images) await deleteFile(img.url);
  await pool.execute('DELETE FROM event WHERE id = ?', [req.params.id]);
  res.json({ message: 'Événement supprimé' });
});

/* ── PATCH /api/admin/events/:id/publish ────────────────────────────── */
router.patch('/:id/publish', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute('SELECT id, published FROM event WHERE id = ? LIMIT 1', [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Événement introuvable' });
  const newState = rows[0].published ? 0 : 1;
  await pool.execute('UPDATE event SET published=?, updated_at=NOW(3) WHERE id=?', [newState, req.params.id]);
  res.json({ published: !!newState });
});

export default router;

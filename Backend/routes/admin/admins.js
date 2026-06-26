/**
 * GET    /api/admin/admins          → liste
 * POST   /api/admin/admins          → créer
 * PUT    /api/admin/admins/:id      → modifier (email, nom, mot de passe)
 * DELETE /api/admin/admins/:id      → supprimer (bloqué si dernier admin)
 *
 * Sécurité serveur :
 *  - Minimum 1 admin garanti (DELETE bloqué si count = 1)
 *  - Un admin ne peut pas se supprimer lui-même
 *  - Passwords bcrypt round 12
 *  - L'email de l'admin appelant est inaccessible depuis les réponses (omis)
 */
import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { getPool } from '../../config/database.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

const BCRYPT_ROUNDS = 12;

const createSchema = z.object({
  name:     z.string().min(2).max(100).trim(),
  email:    z.string().email().max(254).trim().toLowerCase(),
  password: z.string().min(12).max(128),
});

const updateSchema = z.object({
  name:     z.string().min(2).max(100).trim().optional(),
  email:    z.string().email().max(254).trim().toLowerCase().optional(),
  password: z.string().min(12).max(128).optional(),
}).refine(d => Object.keys(d).length > 0, { message: 'Aucun champ à mettre à jour' });

/* ── GET /api/admin/admins ──────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  const [rows] = await getPool().execute(
    'SELECT id, name, email, created_at FROM admin ORDER BY created_at ASC'
  );
  res.json({ admins: rows });
});

/* ── POST /api/admin/admins ─────────────────────────────────────────── */
router.post('/', async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Données invalides',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, password } = parsed.data;
  const pool = getPool();

  const [existing] = await pool.execute(
    'SELECT id FROM admin WHERE email = ? LIMIT 1',
    [email]
  );
  if (existing.length) {
    return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  const hash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const id   = randomUUID();

  await pool.execute(
    'INSERT INTO admin (id, name, email, password) VALUES (?, ?, ?, ?)',
    [id, name, email, hash]
  );

  res.status(201).json({ admin: { id, name, email } });
});

/* ── PUT /api/admin/admins/:id ──────────────────────────────────────── */
router.put('/:id', async (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Données invalides',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id FROM admin WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Administrateur introuvable' });

  const { name, email, password } = parsed.data;

  if (email) {
    const [dup] = await pool.execute(
      'SELECT id FROM admin WHERE email = ? AND id != ? LIMIT 1',
      [email, req.params.id]
    );
    if (dup.length) return res.status(409).json({ error: 'Cet email est déjà utilisé' });
  }

  const sets  = [];
  const vals  = [];

  if (name)     { sets.push('name = ?');     vals.push(name); }
  if (email)    { sets.push('email = ?');    vals.push(email); }
  if (password) {
    sets.push('password = ?');
    vals.push(await bcrypt.hash(password, BCRYPT_ROUNDS));
  }
  sets.push('updated_at = NOW(3)');
  vals.push(req.params.id);

  await pool.execute(
    `UPDATE admin SET ${sets.join(', ')} WHERE id = ?`,
    vals
  );

  const [updated] = await pool.execute(
    'SELECT id, name, email, created_at FROM admin WHERE id = ?',
    [req.params.id]
  );
  res.json({ admin: updated[0] });
});

/* ── DELETE /api/admin/admins/:id ───────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  // Interdiction de se supprimer soi-même
  if (req.params.id === req.admin.id) {
    return res.status(400).json({ error: 'Vous ne pouvez pas supprimer votre propre compte' });
  }

  const pool = getPool();

  // Garantir le minimum d'1 admin
  const [[{ count }]] = await pool.execute('SELECT COUNT(*) AS count FROM admin');
  if (count <= 1) {
    return res.status(400).json({ error: 'Impossible de supprimer le dernier administrateur' });
  }

  const [rows] = await pool.execute(
    'SELECT id FROM admin WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Administrateur introuvable' });

  await pool.execute('DELETE FROM admin WHERE id = ?', [req.params.id]);
  res.json({ message: 'Administrateur supprimé' });
});

export default router;

/**
 * GET    /api/admin/messages        → historique des messages de contact
 * DELETE /api/admin/messages/:id    → supprimer un message
 */
import { Router } from 'express';
import { getPool } from '../../config/database.js';
import { requireAdmin } from '../../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

/* ── GET /api/admin/messages ────────────────────────────────────────── */
router.get('/', async (_req, res) => {
  const [rows] = await getPool().execute(
    'SELECT id, name, email, subject, message, created_at FROM contact_message ORDER BY created_at DESC'
  );
  res.json({ messages: rows });
});

/* ── DELETE /api/admin/messages/:id ────────────────────────────────── */
router.delete('/:id', async (req, res) => {
  const pool = getPool();
  const [rows] = await pool.execute(
    'SELECT id FROM contact_message WHERE id = ? LIMIT 1',
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: 'Message introuvable' });

  await pool.execute('DELETE FROM contact_message WHERE id = ?', [req.params.id]);
  res.json({ message: 'Message supprimé' });
});

export default router;

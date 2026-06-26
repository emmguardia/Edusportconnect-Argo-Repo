import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getPool } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../config/security.js';

const router = Router();

const IS_PROD = process.env.NODE_ENV === 'production';

const loginSchema = z.object({
  email:    z.string().email().max(254),
  password: z.string().min(1).max(128),
});

/* ── POST /api/auth/login ──────────────────────────────────────────── */
router.post('/login', loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Données invalides' });
  }

  const { email, password } = parsed.data;

  const [rows] = await getPool().execute(
    'SELECT id, email, name, password FROM admin WHERE email = ? LIMIT 1',
    [email.toLowerCase()]
  );

  // Même délai si l'email n'existe pas (anti-timing attack)
  const admin = rows[0] ?? null;
  const hash  = admin?.password ?? '$2b$12$invalidehashinvalidehashinvalide';
  const match = await bcrypt.compare(password, hash);

  if (!admin || !match) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'strict',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

  res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
});

/* ── POST /api/auth/logout ─────────────────────────────────────────── */
router.post('/logout', (_req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Déconnecté' });
});

/* ── GET /api/auth/me ──────────────────────────────────────────────── */
router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;

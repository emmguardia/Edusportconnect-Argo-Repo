import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { randomBytes } from 'crypto';
import { getPool } from '../config/database.js';
import { requireAdmin } from '../middleware/auth.js';
import { loginLimiter } from '../config/security.js';

const router = Router();

// Hash bcrypt valide (même coût que les vrais comptes) comparé quand l'email
// n'existe pas : la réponse prend le même temps → impossible de deviner
// les emails admin en mesurant le délai.
const DUMMY_HASH = bcrypt.hashSync(randomBytes(16).toString('hex'), 12);

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
  const hash  = admin?.password ?? DUMMY_HASH;
  const match = await bcrypt.compare(password, hash);

  if (!admin || !match) {
    return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
  }

  const token = jwt.sign(
    { id: admin.id, email: admin.email, name: admin.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // __Host- prefix : force Secure + Path=/ + pas de Domain → impossible à voler via sous-domaine
  res.cookie('__Host-token', token, {
    httpOnly: true,
    secure:   true,
    sameSite: 'strict',
    path:     '/',
    maxAge:   7 * 24 * 60 * 60 * 1000,
  });

  res.json({ admin: { id: admin.id, email: admin.email, name: admin.name } });
});

/* ── POST /api/auth/logout ─────────────────────────────────────────── */
router.post('/logout', (_req, res) => {
  res.clearCookie('__Host-token', { httpOnly: true, secure: true, sameSite: 'strict', path: '/' });
  res.json({ message: 'Déconnecté' });
});

/* ── GET /api/auth/me ──────────────────────────────────────────────── */
router.get('/me', requireAdmin, (req, res) => {
  res.json({ admin: req.admin });
});

export default router;

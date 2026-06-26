import { Router } from 'express';
import { z } from 'zod';
import { getPool } from '../config/database.js';
import { contactLimiter } from '../config/security.js';
import { sendContactConfirmation, sendAdminNotification } from '../utils/email.js';
import { randomUUID } from 'crypto';

const router = Router();

const contactSchema = z.object({
  name:    z.string().min(2).max(100).trim(),
  email:   z.string().email().max(254).trim(),
  subject: z.string().max(255).trim().optional(),
  message: z.string().min(10).max(3000).trim(),
});

/* ── POST /api/contact ─────────────────────────────────────────────── */
router.post('/', contactLimiter, async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Données invalides',
      details: parsed.error.flatten().fieldErrors,
    });
  }

  const { name, email, subject, message } = parsed.data;

  await getPool().execute(
    `INSERT INTO contact_message (id, name, email, subject, message)
     VALUES (?, ?, ?, ?, ?)`,
    [randomUUID(), name, email, subject ?? null, message]
  );

  // Envoi des deux emails — on ne bloque pas la réponse en cas d'échec mail
  try {
    await Promise.all([
      sendContactConfirmation({ name, email }),
      sendAdminNotification({ name, email, subject, message }),
    ]);
  } catch (err) {
    console.error('[contact] Erreur envoi email:', err.message);
  }

  res.json({ message: 'Message envoyé avec succès' });
});

export default router;

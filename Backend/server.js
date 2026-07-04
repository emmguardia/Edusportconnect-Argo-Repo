import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import { applySecurityMiddleware } from './config/security.js';
import authRouter    from './routes/auth.js';
import eventsRouter  from './routes/events.js';
import contactRouter from './routes/contact.js';
import adminEventsRouter  from './routes/admin/events.js';
import adminAdminsRouter  from './routes/admin/admins.js';
import adminContactRouter from './routes/admin/contact.js';

const app  = express();
const PORT = process.env.PORT || 3000;

applySecurityMiddleware(app);

app.use(cookieParser());
app.use(express.json({ limit: '512kb' }));

/* ── Uploads statiques ─────────────────────────────────────────────── */
app.use('/uploads', express.static('uploads'));

/* ── Health ────────────────────────────────────────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'edusport-backend' });
});

/* ── Auth ──────────────────────────────────────────────────────────── */
app.use('/api/auth', authRouter);

/* ── Public ────────────────────────────────────────────────────────── */
app.use('/api/events',  eventsRouter);
app.use('/api/contact', contactRouter);

/* ── Admin ─────────────────────────────────────────────────────────── */
app.use('/api/admin/events',   adminEventsRouter);
app.use('/api/admin/admins',   adminAdminsRouter);
app.use('/api/admin/messages', adminContactRouter);

/* ── 404 ───────────────────────────────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route introuvable' });
});

/* ── Erreur globale ────────────────────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[error]', err.message);
  res.status(500).json({ error: 'Erreur serveur interne' });
});

app.listen(PORT, () => {
  console.log(`[edusport-backend] :${PORT} — NODE_ENV=${process.env.NODE_ENV || 'development'}`);
});

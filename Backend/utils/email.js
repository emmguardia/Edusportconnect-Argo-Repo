import jwt from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const EMAIL_SERVICE_URL = process.env.EMAIL_SERVICE_URL
  || 'http://email-service.email-service.svc.cluster.local:8080';

const PROJECT     = 'edusport-connect';
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@edusportconnect.fr';
const ADMIN_NAME  = 'ÉduSport Connect';

function getPrivateKey() {
  // En prod : clé injectée via variable d'env (depuis le SealedSecret)
  if (process.env.JWT_PRIVATE_KEY) return process.env.JWT_PRIVATE_KEY;
  // En dev local : lire depuis le fichier partagé avec l'Email-Service
  const keyPath = join(__dirname, '..', '..', '..', 'Email-Service', 'secrets', 'jwt_private_key.pem');
  return readFileSync(keyPath, 'utf8');
}

function generateToken() {
  return jwt.sign(
    { project: PROJECT, permissions: ['send_email'] },
    getPrivateKey(),
    { algorithm: 'RS256', issuer: 'email-service', expiresIn: '1h' }
  );
}

async function send(templateId, toEmail, toName, variables = {}, subject = null) {
  const token = generateToken();

  const body = { template_id: templateId, to_email: toEmail, to_name: toName, project: PROJECT, variables };
  if (subject) body.subject = subject;

  const res = await fetch(`${EMAIL_SERVICE_URL}/api/v1/send`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body:    JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Email-Service ${res.status}: ${text}`);
  }
  return res.json();
}

/* ── Confirmation à l'expéditeur ───────────────────────────────────── */
export function sendContactConfirmation({ name, email }) {
  return send('contact', email, name, { name });
}

/* ── Notification admin ────────────────────────────────────────────── */
export function sendAdminNotification({ name, email, subject, message }) {
  return send(
    'admin-notification',
    ADMIN_EMAIL,
    ADMIN_NAME,
    { sender_name: name, sender_email: email, subject: subject || '(sans objet)', message }
  );
}

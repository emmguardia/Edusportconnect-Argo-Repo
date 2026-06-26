import jwt from 'jsonwebtoken';

function extractToken(req) {
  // cookie prioritaire (httpOnly), fallback header Authorization
  if (req.cookies?.token) return req.cookies.token;
  const auth = req.headers.authorization;
  if (auth?.startsWith('Bearer ')) return auth.slice(7);
  return null;
}

export function requireAdmin(req, res, next) {
  const token = extractToken(req);
  if (!token) return res.status(401).json({ error: 'Non authentifié' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Session invalide ou expirée' });
  }
}

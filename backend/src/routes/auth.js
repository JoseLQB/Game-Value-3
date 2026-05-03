import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = Router();
const refreshStore = new Set();

function signAccess(payload) {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

function signRefresh(payload) {
  return jwt.sign(payload, env.refreshSecret, { expiresIn: env.refreshExpiresIn });
}

router.post('/login', (req, res) => {
  const { username, password } = req.body ?? {};
  if (username !== env.adminUser || password !== env.adminPassword) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const payload = { sub: username, role: 'admin' };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  refreshStore.add(refreshToken);

  return res.json({ accessToken, refreshToken, tokenType: 'Bearer' });
});

router.post('/refresh', (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (!refreshToken || !refreshStore.has(refreshToken)) {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }

  try {
    const payload = jwt.verify(refreshToken, env.refreshSecret);
    const accessToken = signAccess({ sub: payload.sub, role: payload.role });
    return res.json({ accessToken, tokenType: 'Bearer' });
  } catch {
    refreshStore.delete(refreshToken);
    return res.status(401).json({ error: 'Refresh token expirado' });
  }
});

router.post('/logout', (req, res) => {
  const { refreshToken } = req.body ?? {};
  if (refreshToken) refreshStore.delete(refreshToken);
  return res.status(204).send();
});

export default router;

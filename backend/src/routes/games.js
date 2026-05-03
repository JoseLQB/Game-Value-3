import { Router } from 'express';
import { games } from '../data/games.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, (req, res) => {
  const { year, platform, minScore, q } = req.query;
  let result = [...games];

  if (year) result = result.filter((g) => g.year === Number(year));
  if (platform) result = result.filter((g) => g.platforms.some((p) => p.toLowerCase() === String(platform).toLowerCase()));
  if (minScore) result = result.filter((g) => g.score >= Number(minScore));
  if (q) result = result.filter((g) => g.title.toLowerCase().includes(String(q).toLowerCase()));

  res.json({ total: result.length, items: result });
});

export default router;

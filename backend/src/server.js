import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ ok: true }));
app.use('/auth', authRoutes);
app.use('/games', gamesRoutes);

app.listen(env.port, () => {
  console.log(`Backend escuchando en http://localhost:${env.port}`);
});

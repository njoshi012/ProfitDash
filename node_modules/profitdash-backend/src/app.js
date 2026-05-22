import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.js';
import shopifyRoutes from './routes/shopify.js';
import metaRoutes from './routes/meta.js';
import metricsRoutes from './routes/metrics.js';
import campaignsRoutes from './routes/campaigns.js';

import { startCronJobs } from './jobs/cronSync.js';

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/auth', authRoutes);
app.use('/api/shopify', shopifyRoutes);
app.use('/api/meta', metaRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/campaigns', campaignsRoutes);

// ── Health check ────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// ── Global error handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// ── Start ───────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`ProfitDash backend running on port ${PORT}`);
  startCronJobs();
});

export default app;

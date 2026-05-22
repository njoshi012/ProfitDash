import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { supabase } from '../db/supabase.js';

const router = express.Router();

// ── Get daily metrics ───────────────────────────────────────
router.get('/daily', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('daily_metrics')
      .select('*')
      .eq('store_id', req.storeId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: metrics, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    res.json(metrics);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get summary metrics (aggregated) ───────────────────────
router.get('/summary', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('daily_metrics')
      .select('spend, revenue, orders, acos, roas, profit, cac')
      .eq('store_id', req.storeId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: metrics, error } = await query;

    if (error) throw error;

    // Aggregate
    const summary = {
      totalSpend: 0,
      totalRevenue: 0,
      totalOrders: 0,
      avgAcos: 0,
      avgRoas: 0,
      totalProfit: 0,
      avgCac: 0,
    };

    let validAcosCount = 0;
    let validRoasCount = 0;
    let validCacCount = 0;

    metrics.forEach(m => {
      summary.totalSpend += m.spend || 0;
      summary.totalRevenue += m.revenue || 0;
      summary.totalOrders += m.orders || 0;
      summary.totalProfit += m.profit || 0;

      if (m.acos) {
        summary.avgAcos += m.acos;
        validAcosCount++;
      }
      if (m.roas) {
        summary.avgRoas += m.roas;
        validRoasCount++;
      }
      if (m.cac) {
        summary.avgCac += m.cac;
        validCacCount++;
      }
    });

    summary.avgAcos = validAcosCount > 0 ? summary.avgAcos / validAcosCount : 0;
    summary.avgRoas = validRoasCount > 0 ? summary.avgRoas / validRoasCount : 0;
    summary.avgCac = validCacCount > 0 ? summary.avgCac / validCacCount : 0;

    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

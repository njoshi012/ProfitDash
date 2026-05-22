import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { supabase } from '../db/supabase.js';

const router = express.Router();

// ── Get campaigns (cached from database) ────────────────────
router.get('/campaigns', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('meta_campaigns')
      .select('*')
      .eq('store_id', req.storeId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: campaigns, error } = await query.order('date', { ascending: false });

    if (error) throw error;

    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get campaign stats aggregated ───────────────────────────
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('meta_campaigns')
      .select('campaign_name, spend, clicks, impressions')
      .eq('store_id', req.storeId);

    if (startDate) {
      query = query.gte('date', startDate);
    }
    if (endDate) {
      query = query.lte('date', endDate);
    }

    const { data: campaigns, error } = await query;

    if (error) throw error;

    // Aggregate by campaign name
    const stats = {};
    campaigns.forEach(c => {
      if (!stats[c.campaign_name]) {
        stats[c.campaign_name] = { spend: 0, clicks: 0, impressions: 0 };
      }
      stats[c.campaign_name].spend += c.spend || 0;
      stats[c.campaign_name].clicks += c.clicks || 0;
      stats[c.campaign_name].impressions += c.impressions || 0;
    });

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Trigger Meta sync (manual) ──────────────────────────────
router.post('/sync', verifyToken, async (req, res) => {
  try {
    // TODO: Call sync service
    res.json({ message: 'Meta sync triggered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

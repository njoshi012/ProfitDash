import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { supabase } from '../db/supabase.js';

const router = express.Router();

// ── Get store info ──────────────────────────────────────────
router.get('/store', verifyToken, async (req, res) => {
  try {
    const { data: store, error } = await supabase
      .from('stores')
      .select('*')
      .eq('id', req.storeId)
      .single();

    if (error) throw error;

    res.json(store);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get orders (cached from database) ───────────────────────
router.get('/orders', verifyToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = supabase
      .from('orders')
      .select('*')
      .eq('store_id', req.storeId);

    if (startDate) {
      query = query.gte('created_at', startDate);
    }
    if (endDate) {
      query = query.lte('created_at', endDate);
    }

    const { data: orders, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Trigger Shopify sync (manual) ───────────────────────────
router.post('/sync', verifyToken, async (req, res) => {
  try {
    // TODO: Call sync service
    res.json({ message: 'Sync triggered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { supabase } from '../db/supabase.js';

const router = express.Router();

// ── Get campaign table data (aggregated) ────────────────────
router.get('/table', verifyToken, async (req, res) => {
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

    // Aggregate by campaign name and fetch revenue for each
    const aggregated = {};

    for (const campaign of campaigns) {
      if (!aggregated[campaign.campaign_name]) {
        aggregated[campaign.campaign_name] = {
          name: campaign.campaign_name,
          spend: 0,
          clicks: 0,
          impressions: 0,
          revenue: 0,
        };
      }
      aggregated[campaign.campaign_name].spend += campaign.spend || 0;
      aggregated[campaign.campaign_name].clicks += campaign.clicks || 0;
      aggregated[campaign.campaign_name].impressions += campaign.impressions || 0;
    }

    // Fetch revenue per campaign from daily_metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('store_id', req.storeId);

    if (metricsError) throw metricsError;

    // For MVP: attribute revenue equally across campaigns
    // (TODO: Implement proper attribution in future)
    const campaignCount = Object.keys(aggregated).length;
    if (campaignCount > 0) {
      const totalRevenue = metrics.reduce((sum, m) => sum + (m.revenue || 0), 0);
      const revenuePerCampaign = totalRevenue / campaignCount;

      Object.keys(aggregated).forEach(name => {
        aggregated[name].revenue = revenuePerCampaign;
      });
    }

    // Calculate ACOS and ROAS for each campaign
    const tableData = Object.values(aggregated).map(c => ({
      name: c.name,
      spend: parseFloat(c.spend.toFixed(2)),
      revenue: parseFloat(c.revenue.toFixed(2)),
      acos: c.revenue > 0 ? parseFloat(((c.spend / c.revenue) * 100).toFixed(2)) : 0,
      roas: c.spend > 0 ? parseFloat((c.revenue / c.spend).toFixed(2)) : 0,
      clicks: c.clicks,
      impressions: c.impressions,
      cpc: c.clicks > 0 ? parseFloat((c.spend / c.clicks).toFixed(2)) : 0,
      ctr: c.impressions > 0 ? parseFloat(((c.clicks / c.impressions) * 100).toFixed(4)) : 0,
    }));

    res.json(tableData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

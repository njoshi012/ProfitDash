import { supabase } from '../../db/supabase.js';

// Default product cost (COGS) - can be customized per store later
const DEFAULT_PRODUCT_COST_PERCENTAGE = 0.35; // 35% of revenue

export async function calculateDailyMetrics(storeId) {
  try {
    // Get all orders and campaigns for today
    const today = new Date().toISOString().split('T')[0];

    // Sum orders for today
    const { data: ordersToday, error: ordersErr } = await supabase
      .from('orders')
      .select('revenue')
      .eq('store_id', storeId)
      .gte('created_at', today)
      .lt('created_at', getNextDay(today));

    if (ordersErr) throw ordersErr;

    // Sum spend for today
    const { data: campaignsToday, error: campaignsErr } = await supabase
      .from('meta_campaigns')
      .select('spend, clicks')
      .eq('store_id', storeId)
      .eq('date', today);

    if (campaignsErr) throw campaignsErr;

    // Calculate totals
    const totalRevenue = ordersToday.reduce((sum, o) => sum + (o.revenue || 0), 0);
    const totalSpend = campaignsToday.reduce((sum, c) => sum + (c.spend || 0), 0);
    const totalOrders = ordersToday.length;
    const totalClicks = campaignsToday.reduce((sum, c) => sum + (c.clicks || 0), 0);

    // Calculate metrics
    const productCost = totalRevenue * DEFAULT_PRODUCT_COST_PERCENTAGE;
    const profit = totalRevenue - totalSpend - productCost;
    const acos = totalRevenue > 0 ? (totalSpend / totalRevenue) * 100 : 0;
    const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
    const cac = totalOrders > 0 ? totalSpend / totalOrders : 0;

    // Upsert daily metric
    const { error } = await supabase
      .from('daily_metrics')
      .upsert(
        {
          store_id: storeId,
          date: today,
          spend: parseFloat(totalSpend.toFixed(2)),
          revenue: parseFloat(totalRevenue.toFixed(2)),
          orders: totalOrders,
          acos: parseFloat(acos.toFixed(4)),
          roas: parseFloat(roas.toFixed(4)),
          profit: parseFloat(profit.toFixed(2)),
          cac: parseFloat(cac.toFixed(2)),
        },
        { onConflict: 'store_id,date' }
      );

    if (error) throw error;

    console.log(`  → Daily metrics calculated for ${today}`);
  } catch (err) {
    console.error(`[Metrics] Error:`, err.message);
    throw err;
  }
}

function getNextDay(dateStr) {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
}

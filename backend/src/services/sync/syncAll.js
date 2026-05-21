import { supabase } from '../../db/supabase.js';
import { syncShopifyOrders } from './syncShopify.js';
import { syncMetaCampaigns } from './syncMeta.js';
import { calculateDailyMetrics } from '../calculations/metrics.js';

export async function syncAllStores() {
  try {
    // Get all stores with tokens
    const { data: stores, error } = await supabase
      .from('stores')
      .select('id, shop, access_token, meta_access_token')
      .not('access_token', 'is', null);

    if (error) throw error;

    console.log(`[Sync] Found ${stores.length} stores to sync`);

    for (const store of stores) {
      try {
        console.log(`[Sync] Syncing store: ${store.shop}`);

        // Sync Shopify orders
        if (store.access_token) {
          await syncShopifyOrders(store.id, store.shop, store.access_token);
          console.log(`  ✓ Shopify orders synced`);
        }

        // Sync Meta campaigns
        if (store.meta_access_token) {
          await syncMetaCampaigns(store.id, store.meta_access_token);
          console.log(`  ✓ Meta campaigns synced`);
        }

        // Calculate daily metrics
        await calculateDailyMetrics(store.id);
        console.log(`  ✓ Daily metrics calculated`);

      } catch (storeErr) {
        console.error(`[Sync] Error syncing store ${store.shop}:`, storeErr.message);
        // Continue with next store
      }
    }

    console.log('[Sync] All stores synced successfully');
  } catch (err) {
    console.error('[Sync] Critical error:', err.message);
    throw err;
  }
}

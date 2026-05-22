import cron from 'node-cron';
import { syncAllStores } from '../services/sync/syncAll.js';

// ── Run sync every day at 2 AM UTC ──────────────────────────
export function startCronJobs() {
  console.log('[Cron] Starting scheduled sync jobs...');

  // Every day at 2:00 AM UTC
  cron.schedule('0 2 * * *', async () => {
    console.log('[Cron] Running daily sync...');
    try {
      await syncAllStores();
      console.log('[Cron] Daily sync completed successfully');
    } catch (err) {
      console.error('[Cron] Sync failed:', err.message);
    }
  });

  // Optional: Run every 6 hours for testing
  if (process.env.NODE_ENV === 'development') {
    cron.schedule('0 */6 * * *', async () => {
      console.log('[Cron] Dev: Running 6-hour sync...');
      try {
        await syncAllStores();
        console.log('[Cron] Dev sync completed');
      } catch (err) {
        console.error('[Cron] Dev sync failed:', err.message);
      }
    });
  }
}

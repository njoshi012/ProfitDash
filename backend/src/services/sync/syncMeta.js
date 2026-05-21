import axios from 'axios';
import { supabase } from '../../db/supabase.js';

const FIELDS = 'id,name,spend,clicks,impressions';

export async function syncMetaCampaigns(storeId, accessToken) {
  try {
    // Get ad accounts first
    const accountsRes = await axios.get('https://graph.facebook.com/v19.0/me/adaccounts', {
      params: {
        fields: 'id,name',
        access_token: accessToken,
      },
    });

    const accounts = accountsRes.data.data;
    if (!accounts || accounts.length === 0) {
      console.log('  → No Meta ad accounts found');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    // Fetch campaigns from each account
    for (const account of accounts) {
      const campaignsRes = await axios.get(
        `https://graph.facebook.com/v19.0/${account.id}/campaigns`,
        {
          params: {
            fields: FIELDS,
            access_token: accessToken,
            limit: 100,
          },
        }
      );

      const campaigns = campaignsRes.data.data;

      // Build upsert payload
      const campaignData = campaigns.map(c => ({
        store_id: storeId,
        campaign_id: c.id,
        campaign_name: c.name,
        spend: parseFloat(c.spend) || 0,
        clicks: parseInt(c.clicks) || 0,
        impressions: parseInt(c.impressions) || 0,
        date: today,
      }));

      // Upsert campaigns
      const { error } = await supabase
        .from('meta_campaigns')
        .upsert(campaignData, { onConflict: 'store_id,campaign_id,date' });

      if (error) throw error;

      console.log(`  → Synced ${campaigns.length} campaigns from ${account.name}`);
    }
  } catch (err) {
    console.error(`[Meta Sync] Error:`, err.message);
    throw err;
  }
}

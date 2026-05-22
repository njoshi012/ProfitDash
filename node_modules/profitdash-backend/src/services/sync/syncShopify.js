import axios from 'axios';
import { supabase } from '../../db/supabase.js';

const ORDERS_QUERY = `{
  orders(first: 250, query: "created:>2024-01-01") {
    edges {
      node {
        id
        name
        createdAt
        totalPriceSet {
          shopMoney {
            amount
          }
        }
      }
    }
  }
}`;

export async function syncShopifyOrders(storeId, shop, accessToken) {
  try {
    const response = await axios.post(
      `https://${shop}/admin/api/2024-01/graphql.json`,
      { query: ORDERS_QUERY },
      {
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data.errors) {
      throw new Error(`Shopify error: ${JSON.stringify(response.data.errors)}`);
    }

    const orders = response.data.data.orders.edges.map(edge => ({
      store_id: storeId,
      order_id: edge.node.id.split('/').pop(),
      revenue: parseFloat(edge.node.totalPriceSet.shopMoney.amount),
      created_at: new Date(edge.node.createdAt).toISOString(),
    }));

    // Upsert orders
    const { error } = await supabase
      .from('orders')
      .upsert(orders, { onConflict: 'store_id,order_id' });

    if (error) throw error;

    console.log(`  → Synced ${orders.length} orders for ${shop}`);
  } catch (err) {
    console.error(`[Shopify Sync] Error:`, err.message);
    throw err;
  }
}

import express from 'express';
import crypto from 'crypto';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { supabase } from '../db/supabase.js';

const router = express.Router();

// ── STEP 1: Initiate Shopify OAuth ──────────────────────────
router.get('/shopify', (req, res) => {
  const { shop } = req.query;

  if (!shop || !isValidShopDomain(shop)) {
    return res.status(400).json({ error: 'Invalid shop parameter' });
  }

  const state = crypto.randomBytes(16).toString('hex');
  const redirectUri = `${process.env.SHOPIFY_APP_URL}/auth/shopify/callback`;
  const scopes = process.env.SHOPIFY_SCOPES;

  // Store state in cookie to verify on callback
  res.cookie('shopify_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 10 * 60 * 1000, // 10 min
  });

  const authUrl =
    `https://${shop}/admin/oauth/authorize` +
    `?client_id=${process.env.SHOPIFY_API_KEY}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  res.redirect(authUrl);
});

// ── STEP 2: Shopify OAuth callback ──────────────────────────
router.get('/shopify/callback', async (req, res) => {
  const { shop, code, state, hmac } = req.query;

  // 1. Validate state
  if (state !== req.cookies.shopify_state) {
    return res.status(403).json({ error: 'State mismatch' });
  }

  // 2. Validate HMAC
  if (!validateHmac(req.query, process.env.SHOPIFY_API_SECRET)) {
    return res.status(403).json({ error: 'HMAC validation failed' });
  }

  // 3. Exchange code for access token
  try {
    const tokenRes = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    });

    const accessToken = tokenRes.data.access_token;

    // 4. Upsert store in Supabase
    const { data: store, error } = await supabase
      .from('stores')
      .upsert(
        { shop, access_token: accessToken },
        { onConflict: 'shop' }
      )
      .select()
      .single();

    if (error) throw error;

    // 5. Issue JWT session
    const sessionToken = jwt.sign(
      { shop, storeId: store.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // 6. Redirect to frontend with token
    res.redirect(
      `${process.env.FRONTEND_URL}/dashboard?token=${sessionToken}&shop=${shop}`
    );

  } catch (err) {
    console.error('[Shopify OAuth error]', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/error?msg=shopify_auth_failed`);
  }
});

// ── Meta OAuth: initiate ────────────────────────────────────
router.get('/meta', (req, res) => {
  const { shop } = req.query;
  const state = Buffer.from(JSON.stringify({ shop })).toString('base64');

  const metaAuthUrl =
    `https://www.facebook.com/v19.0/dialog/oauth` +
    `?client_id=${process.env.META_APP_ID}` +
    `&redirect_uri=${encodeURIComponent(process.env.META_REDIRECT_URI)}` +
    `&scope=ads_read,ads_management,business_management` +
    `&state=${state}`;

  res.redirect(metaAuthUrl);
});

// ── Meta OAuth: callback ─────────────────────────────────────
router.get('/meta/callback', async (req, res) => {
  const { code, state } = req.query;

  let shop;
  try {
    ({ shop } = JSON.parse(Buffer.from(state, 'base64').toString()));
  } catch {
    return res.status(400).json({ error: 'Invalid state' });
  }

  try {
    // Exchange code for long-lived token
    const tokenRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        redirect_uri: process.env.META_REDIRECT_URI,
        code,
      },
    });

    const shortToken = tokenRes.data.access_token;

    // Exchange for long-lived token (60 days)
    const longRes = await axios.get('https://graph.facebook.com/v19.0/oauth/access_token', {
      params: {
        grant_type: 'fb_exchange_token',
        client_id: process.env.META_APP_ID,
        client_secret: process.env.META_APP_SECRET,
        fb_exchange_token: shortToken,
      },
    });

    const metaToken = longRes.data.access_token;

    // Save to store record
    const { error } = await supabase
      .from('stores')
      .update({ meta_access_token: metaToken })
      .eq('shop', shop);

    if (error) throw error;

    res.redirect(`${process.env.FRONTEND_URL}/dashboard?meta=connected&shop=${shop}`);

  } catch (err) {
    console.error('[Meta OAuth error]', err.message);
    res.redirect(`${process.env.FRONTEND_URL}/error?msg=meta_auth_failed`);
  }
});

// ── Helpers ──────────────────────────────────────────────────
function isValidShopDomain(shop) {
  return /^[a-zA-Z0-9-]+\.myshopify\.com$/.test(shop);
}

function validateHmac(query, secret) {
  const { hmac, ...rest } = query;
  const message = Object.keys(rest)
    .sort()
    .map(k => `${k}=${rest[k]}`)
    .join('&');
  const digest = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmac));
}

export default router;

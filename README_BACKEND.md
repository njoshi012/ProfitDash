ProfitDash/
│
├── backend/
│   ├── package.json
│   ├── .env                              [EDIT with your API keys]
│   ├── .env.example
│   │
│   └── src/
│       ├── app.js                        [Express entry point]
│       │
│       ├── db/
│       │   └── supabase.js               [Supabase client]
│       │
│       ├── middleware/
│       │   └── verifyToken.js            [JWT auth middleware]
│       │
│       ├── routes/
│       │   ├── auth.js                   [Shopify + Meta OAuth]
│       │   ├── shopify.js                [Shopify order routes]
│       │   ├── meta.js                   [Meta campaigns routes]
│       │   ├── metrics.js                [Dashboard metrics routes]
│       │   └── campaigns.js              [Campaign table routes]
│       │
│       ├── services/
│       │   ├── sync/
│       │   │   ├── syncAll.js            [Master sync orchestration]
│       │   │   ├── syncShopify.js        [Shopify order sync]
│       │   │   └── syncMeta.js           [Meta ads sync]
│       │   │
│       │   └── calculations/
│       │       └── metrics.js            [ACOS/ROAS/Profit/CAC]
│       │
│       └── jobs/
│           └── cronSync.js               [Daily scheduled sync (2 AM UTC)]
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql        [Database tables + RLS]
│
├── frontend/                             [To be created in Step 3]
│   └── ...
│
├── Procfile                              [Already in root]
├── package.json                          [Already in root]
└── README.md                             [Already in root]


WHAT'S INCLUDED:
================

✅ Express.js Backend
   - OAuth flows (Shopify + Meta)
   - JWT authentication
   - REST API routes
   - Error handling
   - CORS middleware

✅ Data Sync Services
   - Shopify order fetching (GraphQL)
   - Meta campaigns sync
   - Daily metrics calculation (ACOS/ROAS/Profit/CAC)
   - Cron job (runs daily at 2 AM UTC)

✅ Database
   - Supabase PostgreSQL schema
   - 4 main tables (stores, orders, meta_campaigns, daily_metrics)
   - Row-level security
   - Proper indexes

✅ Environment Configuration
   - .env template with all required variables
   - Ready for Railway deployment


NEXT STEPS:
===========

1. Download the ProfitDash folder

2. Copy into your actual repo:
   rm -rf your-local-repo/backend
   cp -r ProfitDash/backend your-local-repo/
   cp -r ProfitDash/supabase your-local-repo/

3. Navigate to backend:
   cd your-local-repo/backend

4. Install dependencies:
   npm install

5. Configure .env with real API keys:
   SHOPIFY_API_KEY=xxx
   SHOPIFY_API_SECRET=xxx
   META_APP_ID=xxx
   META_APP_SECRET=xxx
   SUPABASE_URL=xxx
   SUPABASE_SERVICE_ROLE_KEY=xxx

6. Create Supabase tables:
   - Copy & run supabase/migrations/001_initial_schema.sql in Supabase SQL editor
   - OR use Supabase migrations CLI

7. Test locally:
   npm run dev
   → Should start on http://localhost:3001

8. Push to GitHub:
   git add backend/ supabase/
   git commit -m "Add complete backend implementation"
   git push origin main

9. Railway will auto-deploy ✅

10. Get your Railway URL from Settings → Networking → Generate Domain

11. Update Shopify Partner Dashboard with that URL


FILES EXPLAINED:
================

app.js
  - Express server setup
  - Middleware configuration (CORS, JSON, cookies)
  - Route registration
  - Health check endpoint
  - Global error handler

auth.js (routes)
  - GET /auth/shopify → Initiate Shopify OAuth
  - GET /auth/shopify/callback → Handle OAuth callback
  - GET /auth/meta → Initiate Meta OAuth
  - GET /auth/meta/callback → Handle Meta OAuth callback
  - HMAC validation for Shopify
  - JWT token generation

shopify.js (routes)
  - GET /api/shopify/store → Get store info
  - GET /api/shopify/orders → Get cached orders
  - POST /api/shopify/sync → Trigger manual sync

meta.js (routes)
  - GET /api/meta/campaigns → Get cached campaigns
  - GET /api/meta/stats → Aggregated campaign stats
  - POST /api/meta/sync → Trigger manual sync

metrics.js (routes)
  - GET /api/metrics/daily → Daily metrics by date range
  - GET /api/metrics/summary → Aggregated summary (spend, revenue, ACOS, ROAS, etc.)

campaigns.js (routes)
  - GET /api/campaigns/table → Campaign table with ACOS/ROAS per campaign

syncShopify.js (service)
  - Fetches orders from Shopify GraphQL API
  - Upserts to orders table
  - Runs daily via cron

syncMeta.js (service)
  - Fetches campaigns from Meta Marketing API
  - Gets ad account IDs
  - Upserts to meta_campaigns table
  - Runs daily via cron

metrics.js (calculations)
  - Calculates ACOS = (Spend / Revenue) * 100
  - Calculates ROAS = Revenue / Spend
  - Calculates Profit = Revenue - Spend - (Revenue * 35% COGS)
  - Calculates CAC = Spend / Orders
  - Stores in daily_metrics table

cronSync.js (jobs)
  - Runs every day at 2 AM UTC
  - Calls syncAllStores()
  - Falls back to 6-hour sync in development

syncAll.js (orchestration)
  - Gets all stores from database
  - For each store:
    - Sync Shopify orders
    - Sync Meta campaigns
    - Calculate daily metrics
  - Error handling (continues on individual store errors)


FORMULAS USED:
==============

ACOS (Ad Cost of Sale)
  = (Total Ad Spend / Total Revenue) × 100
  Example: Spend $500, Revenue $2000 → ACOS = 25%
  Lower is better

ROAS (Return on Ad Spend)
  = Total Revenue / Total Ad Spend
  Example: Spend $500, Revenue $2000 → ROAS = 4.0x
  Higher is better (>3x is healthy for D2C)

Profit
  = Revenue - Ad Spend - Product Cost
  Product Cost = Revenue × 35% (default COGS)
  Customizable per store later

CAC (Customer Acquisition Cost)
  = Total Ad Spend / Number of Orders
  Example: Spend $500, 50 orders → CAC = $10
  Lower is better


READY TO DEPLOY:
================

Once you have all files:
1. Edit .env with real credentials
2. Run database migrations in Supabase
3. Push to GitHub
4. Railway deploys automatically
5. Get public URL
6. Update Shopify Partner Dashboard
7. Install your app in a test Shopify store
8. See it work! 🚀

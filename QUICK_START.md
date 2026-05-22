QUICK START - INTEGRATE FILES INTO YOUR REPO
=============================================

You have two options:

OPTION 1: Extract Archive (Fastest)
===================================

1. Download: ProfitDash.tar.gz
2. In your project root:
   tar -xzf ProfitDash.tar.gz
3. Copy to your repo:
   cp -r ProfitDash/backend your-repo/
   cp -r ProfitDash/supabase your-repo/
4. Done! Folder structure is ready.


OPTION 2: Copy Folder Directly
===============================

1. Download: ProfitDash folder
2. In your project root:
   cp -r ProfitDash/backend ./
   cp -r ProfitDash/supabase ./
3. Done!


OPTION 3: Manual Copy (If you already have structure)
====================================================

Just copy individual files from:
  ProfitDash/backend/src/... → your-repo/backend/src/...
  ProfitDash/supabase/... → your-repo/supabase/...


WHAT YOU'LL HAVE:
=================

your-repo/
├── backend/
│   ├── package.json
│   ├── .env (edit with your keys)
│   ├── .env.example
│   └── src/
│       ├── app.js
│       ├── db/supabase.js
│       ├── middleware/verifyToken.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── shopify.js
│       │   ├── meta.js
│       │   ├── metrics.js
│       │   └── campaigns.js
│       ├── services/
│       │   ├── sync/
│       │   │   ├── syncAll.js
│       │   │   ├── syncShopify.js
│       │   │   └── syncMeta.js
│       │   └── calculations/metrics.js
│       └── jobs/cronSync.js
│
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql


SETUP CHECKLIST:
================

After copying files:

[ ] 1. npm install (in backend folder)
[ ] 2. Edit .env with your API keys
[ ] 3. Create Supabase tables
      - Copy 001_initial_schema.sql
      - Paste in Supabase SQL Editor
      - Run
[ ] 4. Test locally: npm run dev
[ ] 5. Push to GitHub: git add . && git commit && git push
[ ] 6. Railway auto-deploys
[ ] 7. Get URL from Railway
[ ] 8. Update Shopify Partner Dashboard URLs
[ ] 9. Test OAuth flow with test Shopify store
[ ] 10. Check data syncing in Supabase


ENVIRONMENT VARIABLES (.env):
==============================

PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

JWT_SECRET=dev_secret_change_in_production

SHOPIFY_API_KEY=your_key_here
SHOPIFY_API_SECRET=your_secret_here
SHOPIFY_SCOPES=read_orders,read_products,read_analytics
SHOPIFY_APP_URL=http://localhost:3001 (local) or your Railway URL

META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
META_REDIRECT_URI=http://localhost:3001/auth/meta/callback (local)

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key


TESTING LOCALLY:
================

1. Start backend:
   cd backend
   npm run dev
   → Runs on http://localhost:3001

2. Health check:
   curl http://localhost:3001/health
   → Should return { "status": "ok" }

3. Check logs for cron job startup:
   "[Cron] Starting scheduled sync jobs..."

4. Test endpoints when you have a store:
   GET http://localhost:3001/auth/shopify?shop=yourdomain.myshopify.com
   → Should redirect to Shopify OAuth


DEPLOYMENT (Railway):
====================

Your Procfile already handles it:
  web: cd backend && node src/app.js

Railway will:
1. Detect Procfile
2. Install npm dependencies
3. Run: node src/app.js
4. Assign public URL
5. Start listening on PORT (3001)

Set Environment Variables in Railway Dashboard:
- Click Variables tab
- Paste all .env variables
- Save → Auto redeploys


NEXT STEPS (After Backend works):
==================================

1. Confirm Railway URL works:
   https://your-railway-app.up.railway.app/health

2. Update Shopify Partner Dashboard:
   App URL: https://your-railway-app.up.railway.app/auth/shopify
   Redirect: https://your-railway-app.up.railway.app/auth/shopify/callback

3. Update FRONTEND_URL in backend .env to your Vercel URL

4. Install app in test Shopify store

5. Watch OAuth flow → Should redirect to dashboard

6. Once backend works, build frontend (Step 2)


TROUBLESHOOTING:
================

App crashes on startup?
→ Check logs for error
→ Usually missing env variables
→ Verify all 12 env vars are set

Can't connect to Supabase?
→ Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
→ Make sure tables exist (run schema.sql)

OAuth returns error?
→ Check SHOPIFY_APP_URL matches Partner Dashboard
→ Check HMAC validation (shouldn't fail if URL matches)

No orders syncing?
→ Check cron logs
→ Verify Shopify access token is saved in database
→ Manually test: POST /api/shopify/sync with valid JWT


QUESTIONS?
==========

Each file has comments explaining:
- What it does
- How it works
- What to customize

Read through any file for details!


YOU'RE READY! 🚀
================

Download ProfitDash folder or tar.gz
Extract/copy to your repo
Follow checklist above
Deploy to Railway
Test OAuth
Ready for frontend!

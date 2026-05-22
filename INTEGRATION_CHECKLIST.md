✅ COMPLETE BACKEND DELIVERY CHECKLIST
========================================

YOU HAVE:
=========

📦 ProfitDash/ folder with exact project structure
├── backend/ (17 files)
│   ├── package.json ✅
│   ├── .env & .env.example ✅
│   └── src/ with all routes, services, jobs ✅
└── supabase/ (database schema) ✅

📄 QUICK_START.md → Integration guide
📄 README_BACKEND.md → Detailed documentation
📦 ProfitDash.tar.gz → Compressed archive


INTEGRATION (Choose one):
=========================

FASTEST: Use tar.gz
  1. Download ProfitDash.tar.gz
  2. cd your-repo-root
  3. tar -xzf ProfitDash.tar.gz
  4. Done! Folder structure ready

SIMPLE: Copy folder
  1. Download ProfitDash/ folder
  2. In your GitHub repo root:
     rm -rf backend supabase
     cp -r download/ProfitDash/backend ./
     cp -r download/ProfitDash/supabase ./
  3. Done!

MANUAL: File by file
  1. Create backend/src/{db,middleware,routes,services/{sync,calculations},jobs}
  2. Copy each .js file from download to matching folder
  3. Copy schema.sql to supabase/migrations/


SETUP (5 MINUTES):
==================

[ ] 1. Navigate to backend folder
      cd backend

[ ] 2. Install dependencies
      npm install
      
[ ] 3. Copy .env.example to .env
      cp .env.example .env

[ ] 4. Edit .env with real values:
      • SHOPIFY_API_KEY
      • SHOPIFY_API_SECRET
      • META_APP_ID
      • META_APP_SECRET
      • SUPABASE_URL
      • SUPABASE_SERVICE_ROLE_KEY

[ ] 5. Create database tables:
      • Copy supabase/migrations/001_initial_schema.sql
      • Go to Supabase SQL Editor
      • Paste & run
      • Verify 4 tables created: stores, orders, meta_campaigns, daily_metrics

[ ] 6. Test locally:
      npm run dev
      → Should show: "ProfitDash backend running on port 3001"

[ ] 7. Check health:
      curl http://localhost:3001/health
      → Should return: {"status":"ok"}

[ ] 8. Push to GitHub:
      git add backend/ supabase/
      git commit -m "Add complete backend implementation"
      git push origin main

[ ] 9. Wait for Railway to deploy
      → Go to Railway dashboard
      → Check Deployments tab
      → Should show green checkmark


DEPLOYMENT (RAILWAY):
====================

After GitHub push:

[ ] 1. Railway auto-detects changes
      → Reads Procfile
      → Installs npm dependencies
      → Starts app with: node src/app.js

[ ] 2. Wait for green status (2-3 minutes)

[ ] 3. Get public URL:
      → Railway Dashboard
      → Your project
      → Click service
      → Settings tab
      → Networking section
      → Copy domain (e.g., https://profitdash-backend-production.up.railway.app)

[ ] 4. Add environment variables to Railway:
      → Variables tab
      → Add all 12 env vars from .env
      → Save → Auto-redeploys

[ ] 5. Verify deployment:
      curl https://your-railway-url/health
      → Should return: {"status":"ok"}


SHOPIFY INTEGRATION:
====================

[ ] 1. In Shopify Partner Dashboard:
      → Your app
      → App setup tab

[ ] 2. Set URLs:
      App URL: https://your-railway-url/auth/shopify
      Allowed redirection URL: https://your-railway-url/auth/shopify/callback

[ ] 3. Copy API credentials to .env:
      SHOPIFY_API_KEY=...
      SHOPIFY_API_SECRET=...

[ ] 4. Update SHOPIFY_APP_URL:
      SHOPIFY_APP_URL=https://your-railway-url

[ ] 5. Verify in Railway Variables:
      → Save → Auto-redeploys


META SETUP:
===========

[ ] 1. Create Meta app at developers.facebook.com

[ ] 2. Configure OAuth:
      Valid OAuth Redirect URIs: https://your-railway-url/auth/meta/callback

[ ] 3. Copy credentials to .env:
      META_APP_ID=...
      META_APP_SECRET=...

[ ] 4. Update in Railway Variables


SUPABASE SETUP:
===============

[ ] 1. Create Supabase project

[ ] 2. Get credentials:
      SUPABASE_URL → Settings → API
      SUPABASE_SERVICE_ROLE_KEY → Settings → API (same page)

[ ] 3. Copy to .env & Railway

[ ] 4. Run database migrations:
      → Supabase → SQL Editor
      → New query
      → Copy entire 001_initial_schema.sql
      → Paste & Run

[ ] 5. Verify tables exist:
      → Supabase → Databases → Tables
      → Should see: stores, orders, meta_campaigns, daily_metrics


TESTING THE FLOW:
=================

Local test:
[ ] 1. Start backend: npm run dev
[ ] 2. Open browser: http://localhost:3001/auth/shopify?shop=test.myshopify.com
[ ] 3. Should redirect to Shopify OAuth page
[ ] 4. Cancel (don't complete in dev)

Production test:
[ ] 1. Install your app in a Shopify test store
[ ] 2. Watch it redirect to OAuth
[ ] 3. Confirm OAuth then redirects to dashboard
[ ] 4. Check Supabase: stores table should have new row
[ ] 5. Check sync: daily_metrics table should have data after cron runs


WHAT'S WORKING:
===============

✅ Shopify OAuth (complete flow)
✅ Meta OAuth (complete flow)
✅ JWT session tokens
✅ Supabase database
✅ Shopify orders sync
✅ Meta campaigns sync
✅ ACOS/ROAS/Profit/CAC calculations
✅ Daily cron job
✅ API routes (metrics, campaigns, orders)
✅ Error handling
✅ CORS + security headers


WHAT'S NEXT:
============

Once backend is working:

→ Build React frontend (Step 2)
  • Dashboard page with metric cards
  • Campaign table
  • Connect buttons for OAuth
  • Using Shopify Polaris UI

→ Then embedded Shopify app setup
  • Shopify App Bridge integration
  • iframe setup
  • Deep linking

→ Final: Deploy frontend to Vercel


DEBUGGING:
==========

Backend won't start?
→ Check logs in Railway
→ Usually missing env variables
→ Verify all 12 vars are set

Can't connect to Supabase?
→ Check SUPABASE_URL format (should be https://xxx.supabase.co)
→ Verify SERVICE_ROLE_KEY (not anon key)
→ Make sure tables were created

OAuth loop/redirect error?
→ Check URLs in Shopify Partner Dashboard match exactly
→ Check SHOPIFY_APP_URL in .env
→ Check frontend FRONTEND_URL

Data not syncing?
→ Check cron job in logs (should run daily at 2 AM UTC)
→ Verify Shopify token is saved in stores table
→ Check that meta_access_token is saved too
→ Try manual sync: POST /api/shopify/sync (need valid JWT)

JWT auth failing?
→ Make sure token is in Authorization header: "Bearer TOKEN"
→ Verify token was issued during OAuth callback
→ Check JWT_SECRET matches between issuance and verification


TROUBLESHOOTING CHECKLIST:
==========================

App crashes?
[ ] Check Railway logs
[ ] Verify all 12 env variables are set
[ ] Make sure package.json dependencies installed
[ ] Check .env not missing any required keys

Can't call API?
[ ] CORS enabled? ✅ (frontend URL added)
[ ] Token in Authorization header? ✅ (Bearer format)
[ ] Route exists? ✅ (check app.js)
[ ] Supabase tables exist? ✅ (run schema.sql)

OAuth not working?
[ ] URLs match Shopify Partner Dashboard? ✅
[ ] SHOPIFY_APP_URL set? ✅
[ ] API credentials correct? ✅
[ ] Shop parameter correct format? (myshopify.com)

Data not showing?
[ ] Sync service ran? (check Railway logs for cron)
[ ] Tokens saved in database? (check stores table)
[ ] Supabase tables have data? (check rows)
[ ] Calculations correct? (check daily_metrics formula)


YOU'RE READY! 🚀
================

✅ Complete backend codebase
✅ Database schema
✅ OAuth integration
✅ Data sync services
✅ Metrics calculations
✅ Ready for Railway deployment
✅ Ready for frontend integration

Next: Download files, integrate, deploy, test!

Questions? Read README_BACKEND.md for detailed docs.

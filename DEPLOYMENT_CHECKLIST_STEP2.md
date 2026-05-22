🚀 STEP 2 DEPLOYMENT CHECKLIST
================================

WHAT YOU HAVE:

✅ Backend (Railway)
   - Running on: https://profitdash-production.up.railway.app
   - Health check: /health → {"status":"ok"}
   - OAuth routes: /auth/shopify, /auth/meta
   - API routes: /api/metrics, /api/campaigns, /api/shopify

✅ Frontend (Ready for Vercel)
   - 20 files organized
   - React + Vite + Polaris
   - OAuth integration
   - Dashboard UI complete
   - All hooks + components
   - Error handling included


DEPLOYMENT STEPS (5 MINUTES):

1. Install frontend dependencies:
   cd frontend
   npm install

2. Create .env file:
   cp .env.example .env
   
   Edit and add:
   VITE_BACKEND_URL=https://profitdash-production.up.railway.app

3. Test locally (optional):
   npm run dev
   Open: http://localhost:3000
   
4. Build for production:
   npm run build
   Creates: frontend/dist/ folder

5. Deploy to Vercel:
   Option A - GitHub (Recommended):
   a) Push to GitHub:
      git add frontend/
      git commit -m "Add React frontend"
      git push origin main
   
   b) Go to: https://vercel.com/dashboard
   c) Click: "Add New" → "Project"
   d) Select: Your GitHub repo
   e) Framework: React
   f) Root Directory: frontend
   g) Build Command: npm run build
   h) Output Directory: dist
   i) Environment Variables:
      - VITE_BACKEND_URL=https://profitdash-production.up.railway.app
   j) Click: Deploy
   
   Option B - CLI:
   npm install -g vercel
   cd frontend
   vercel
   (Follow prompts)

6. Get your Vercel URL:
   Example: https://profitdash.vercel.app


UPDATE SHOPIFY PARTNER DASHBOARD:

1. Go to: https://partners.shopify.com/
2. Select your app
3. Click: "App setup" tab
4. Update URLs:
   
   App URL:
   https://profitdash.vercel.app/
   
   Allowed redirection URL:
   https://profitdash-production.up.railway.app/auth/shopify/callback
   
5. Save


VERIFY EVERYTHING WORKS:

1. Test backend health:
   curl https://profitdash-production.up.railway.app/health
   → {"status":"ok"}

2. Test frontend loads:
   Open: https://profitdash.vercel.app
   → Should show "Connect Shopify" page

3. Test OAuth flow:
   a) Enter shop URL: your-test-store.myshopify.com
   b) Click "Connect Shopify"
   c) Authorize in Shopify
   d) Should redirect to dashboard
   e) Wait for data to populate


WHAT EACH FILE DOES:

Components (5):
  MetricCard.jsx ......... Displays KPI cards (Revenue, Spend, etc.)
  CampaignTable.jsx ...... Shows campaign performance with metrics
  DateRangePicker.jsx .... Date selection (7/30/90 days or custom)
  Loading.jsx ............ Spinner during data fetch
  ErrorBanner.jsx ........ Shows error messages

Pages (3):
  Dashboard.jsx .......... Main dashboard (2 tabs: Overview + Campaigns)
  ConnectShopify.jsx ..... Landing page with OAuth
  ConnectMeta.jsx ........ Meta connection (future expansion)

Hooks (3):
  useAuth.js ............ Auth state management (Zustand)
  useMetrics.js ......... Fetch dashboard summary metrics
  useCampaigns.js ....... Fetch campaign table data

Core:
  main.jsx ............. React entry point
  App.jsx .............. Main app component (routing)
  api.js ............... Axios client with interceptors
  package.json ......... Dependencies
  vite.config.js ....... Build configuration
  index.html ........... HTML entry point


FRONTEND FEATURES:

OAuth Flow:
  ✅ Shopify OAuth integration
  ✅ JWT token handling
  ✅ Persistent session (localStorage)
  ✅ Auto-logout on token expiry

Dashboard:
  ✅ Tab 1: 6 KPI cards
     - Total Revenue (green)
     - Ad Spend (red)
     - Net Profit (blue)
     - ACOS % (red/amber/green)
     - ROAS x (red/amber/green)
     - CAC $ (purple)
     - Orders count

  ✅ Tab 2: Campaign table
     - Campaign name
     - Spend + Revenue
     - ACOS % (with badge)
     - ROAS x (with badge)
     - Clicks, Impressions
     - CPC (Cost per click)

Date Range:
  ✅ Quick presets (7/30/90 days)
  ✅ Custom range slider (1-365 days)
  ✅ Auto-fetches data on change

UI/UX:
  ✅ Shopify Polaris components
  ✅ Mobile responsive
  ✅ Dark mode support
  ✅ Loading states
  ✅ Error handling
  ✅ Accessible (WCAG 2.1)


ENVIRONMENT VARIABLES:

Frontend (.env):
  VITE_BACKEND_URL=https://profitdash-production.up.railway.app

Vercel Settings:
  Environment Variables (Project Settings → Environment Variables):
  VITE_BACKEND_URL=https://profitdash-production.up.railway.app

Backend (Railway - already set):
  - SHOPIFY_API_KEY
  - SHOPIFY_API_SECRET
  - META_APP_ID
  - META_APP_SECRET
  - SUPABASE_URL
  - SUPABASE_SERVICE_ROLE_KEY
  - FRONTEND_URL (should be your Vercel URL)


FILE ORGANIZATION:

ProfitDash/
├── backend/ ..................... Node.js backend
├── frontend/ .................... React frontend
│   ├── package.json ............ Dependencies
│   ├── vite.config.js ......... Build config
│   ├── index.html ............. Entry HTML
│   ├── .env.example ........... Env template
│   └── src/
│       ├── main.jsx ........... Entry point
│       ├── App.jsx ............ Main component
│       ├── components/ ........ 5 reusable components
│       ├── pages/ ............. 3 page components
│       ├── hooks/ ............. 3 custom hooks
│       └── utils/ ............. API client
├── supabase/ ................... Database migrations
├── Procfile
├── package.json (root)
└── README.md


TESTING CHECKLIST:

Local Testing:
  [ ] npm install (frontend)
  [ ] npm run dev
  [ ] Open http://localhost:3000
  [ ] See "Connect Shopify" page

Backend Testing:
  [ ] curl /health endpoint
  [ ] Verify response: {"status":"ok"}
  [ ] Check that it's accessible from Vercel

OAuth Testing:
  [ ] Enter test shop URL
  [ ] Click "Connect Shopify"
  [ ] Authorize in Shopify
  [ ] Check redirect works
  [ ] Verify token saved in localStorage

Dashboard Testing:
  [ ] Check Overview tab loads
  [ ] Verify metric cards display
  [ ] Check Campaigns tab loads
  [ ] Verify campaign table displays
  [ ] Test date range picker
  [ ] Confirm data updates


PERFORMANCE:

Build output:
  - index.html: ~1 KB
  - main.js: ~150 KB (minified + gzipped)
  - main.css: ~50 KB (Polaris styles)
  - Total: ~200 KB

Vercel will:
  - Minify + optimize assets
  - Enable gzip compression
  - CDN deliver from edge
  - Cache assets globally
  - Result: Fast load times


SECURITY:

✅ JWT tokens
  - Issued by backend
  - Stored in localStorage
  - Sent in Authorization header
  - Auto-logout on 401

✅ OAuth
  - Handled by backend
  - Frontend never sees API keys
  - HMAC validation on Shopify

✅ CORS
  - Backend allows Vercel URL
  - Frontend proxies through backend

✅ Environment variables
  - Never committed to git
  - Set in Vercel dashboard
  - Hidden from public


WHAT HAPPENS ON PRODUCTION:

1. User goes to: https://profitdash.vercel.app
2. React app loads (from Vercel CDN)
3. App checks for token in localStorage
4. If no token → show "Connect Shopify"
5. User enters shop → clicks "Connect"
6. Frontend redirects to backend OAuth
7. Backend redirects to Shopify
8. User authorizes app
9. Shopify redirects back to backend
10. Backend saves token in Supabase
11. Backend issues JWT and redirects to frontend with token
12. Frontend saves token, renders Dashboard
13. Dashboard fetches metrics from /api/metrics/summary
14. Metrics populate in real-time
15. User can view campaigns and change date range


TROUBLESHOOTING:

Frontend won't load?
→ Check Vercel deployment status
→ Check console for errors
→ Verify VITE_BACKEND_URL is correct
→ Check backend is running

Can't connect Shopify?
→ Verify shop URL format (.myshopify.com)
→ Check Shopify Partner Dashboard URLs match
→ Check backend /auth/shopify route works
→ Check network tab for redirect

No data showing?
→ Check cron job ran (daily at 2 AM UTC)
→ Verify tokens saved in Supabase
→ Check /api/metrics/summary endpoint
→ Check network tab for API errors

CORS errors?
→ Frontend URL must be in backend CORS config
→ Update FRONTEND_URL in Railway
→ Restart backend service


NEXT STEPS AFTER DEPLOYMENT:

1. ✅ Backend deployed (Step 1) ✓
2. ✅ Frontend deployed (Step 2) ✓
3. 🔄 Optional: Add Shopify App Bridge for embedded experience
4. 🔄 Optional: Add Meta OAuth completion page
5. 🔄 Optional: Add more detailed attribution modeling

For now, you have a complete MVP!


YOU'RE READY! 🚀

Next action:
1. npm install (frontend)
2. .env setup
3. Deploy to Vercel
4. Update Shopify Partner Dashboard
5. Test OAuth flow
6. Install in test store
7. Success!

Questions? Read FRONTEND_SETUP.md for detailed docs.

# 🎨 ProfitDash Frontend - Complete Setup Guide

## What You're Getting

✅ **React + Vite** - Fast development server  
✅ **Shopify Polaris** - Beautiful UI components  
✅ **OAuth Integration** - Shopify + Meta authentication  
✅ **Dashboard** - Real-time metrics display  
✅ **Campaign Table** - Performance tracking  
✅ **Date Range Picker** - Custom period filtering  
✅ **Zustand** - State management  
✅ **Axios** - API client with interceptors  

---

## Folder Structure

```
frontend/
├── package.json ..................... Dependencies
├── vite.config.js .................. Vite config
├── index.html ...................... Entry HTML
├── .env.example .................... Environment template
├── .eslintrc.json .................. Linting rules
├── .gitignore ...................... Git ignore
│
└── src/
    ├── main.jsx .................... React entry point
    ├── App.jsx ..................... Main app component
    │
    ├── components/
    │   ├── Loading.jsx ............ Spinner component
    │   ├── ErrorBanner.jsx ........ Error display
    │   ├── MetricCard.jsx ......... KPI cards
    │   ├── CampaignTable.jsx ...... Campaign table
    │   └── DateRangePicker.jsx ... Date selector
    │
    ├── pages/
    │   ├── ConnectShopify.jsx .... OAuth login page
    │   ├── ConnectMeta.jsx ....... Meta connection page
    │   └── Dashboard.jsx ......... Main dashboard
    │
    ├── hooks/
    │   ├── useAuth.js ............ Auth state (Zustand)
    │   ├── useMetrics.js ......... Metrics fetching
    │   └── useCampaigns.js ...... Campaign fetching
    │
    └── utils/
        └── api.js ................ Axios client
```

---

## Setup (5 MINUTES)

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

### Step 2: Create .env File

```bash
cp .env.example .env
```

Edit `.env`:

```
VITE_BACKEND_URL=http://localhost:3001
```

Or for production:

```
VITE_BACKEND_URL=https://profitdash-production.up.railway.app
```

### Step 3: Start Development Server

```bash
npm run dev
```

Open: `http://localhost:3000`

### Step 4: Build for Production

```bash
npm run build
```

Output goes to `dist/` folder

---

## File Breakdown

### Entry Point (main.jsx + App.jsx)

- Checks for token in URL (after OAuth callback)
- Renders ConnectShopify if not authenticated
- Renders Dashboard if authenticated

### Authentication (hooks/useAuth.js)

Zustand store with:
- `getTokenFromURL()` - Extract token after OAuth
- `loginWithShopify(shop)` - Initiate Shopify OAuth
- `loginWithMeta()` - Initiate Meta OAuth
- `logout()` - Clear session

### API Client (utils/api.js)

Axios instance with:
- Base URL from environment variable
- Authorization header interceptor
- Auto-logout on 401 errors

### Components

**Loading.jsx** - Spinner during data fetch
**ErrorBanner.jsx** - Error message display
**MetricCard.jsx** - KPI display (revenue, spend, ACOS, etc.)
**CampaignTable.jsx** - Campaign performance table with ACOS/ROAS badges
**DateRangePicker.jsx** - 7/30/90 day presets + custom range slider

### Hooks

**useAuth.js** - Authentication state + methods
**useMetrics.js** - Fetch dashboard summary metrics
**useCampaigns.js** - Fetch campaign table data

### Pages

**ConnectShopify.jsx** - Landing page with shop URL input
**ConnectMeta.jsx** - Meta Ads connection (for future use)
**Dashboard.jsx** - Main dashboard with tabs:
  - Tab 0: Overview (6 metric cards + orders)
  - Tab 1: Campaigns (performance table)

---

## OAuth Flow

### Shopify OAuth

1. User enters shop URL (e.g., `mystore.myshopify.com`)
2. Frontend calls: `GET /auth/shopify?shop=mystore.myshopify.com`
3. Backend redirects to Shopify OAuth
4. User authorizes app
5. Shopify redirects to: `frontend-url/dashboard?token=xxx&shop=mystore.myshopify.com`
6. App saves token + shop in localStorage
7. Dashboard renders

### Meta OAuth

1. User clicks "Connect Meta Ads"
2. Frontend calls: `GET /auth/meta?shop=mystore.myshopify.com`
3. Backend redirects to Meta OAuth
4. User authorizes app
5. Meta redirects to: `backend-url/auth/meta/callback`
6. Backend saves token in Supabase
7. (Frontend can listen for update in future versions)

---

## Environment Variables

### Development

```
VITE_BACKEND_URL=http://localhost:3001
```

### Production (Vercel)

```
VITE_BACKEND_URL=https://profitdash-production.up.railway.app
```

**Note**: Vercel automatically loads `.env` files. Set environment variables in:
- **Vercel Dashboard** → Project → Settings → Environment Variables

---

## Deployment to Vercel

### Option 1: Connect GitHub (Recommended)

1. **Push frontend to GitHub**
   ```bash
   git add frontend/
   git commit -m "Add React frontend"
   git push origin main
   ```

2. **Go to Vercel**
   - https://vercel.com/dashboard
   - Click "Add New" → "Project"
   - Select your GitHub repo
   - Framework: **React**
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - In Vercel Dashboard
   - Settings → Environment Variables
   - Add: `VITE_BACKEND_URL=https://profitdash-production.up.railway.app`

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Get your Vercel URL (e.g., `https://profitdash.vercel.app`)

### Option 2: Deploy via CLI

```bash
npm install -g vercel
cd frontend
vercel
```

Follow prompts to deploy

---

## Local Development

### Start Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

### Test OAuth Locally

1. **Create test Shopify store**
   - https://partners.shopify.com/
   - Create development store

2. **Update Shopify Partner Dashboard**
   - App URL: `http://localhost:3001/auth/shopify`
   - Redirect URL: `http://localhost:3001/auth/shopify/callback`

3. **Update frontend .env**
   ```
   VITE_BACKEND_URL=http://localhost:3001
   ```

4. **Open browser**
   - http://localhost:3000
   - Enter shop: `yourdevstore.myshopify.com`
   - Click "Connect"
   - Should redirect to Shopify OAuth
   - Authorize
   - Should redirect back to dashboard

---

## Architecture

```
┌─────────────────────────────────────┐
│         Vercel Frontend             │
│  React + Polaris + Zustand          │
└─────────────────────────────────────┘
              ↓ (API calls)
┌─────────────────────────────────────┐
│      Railway Backend (Node.js)       │
│  Express + OAuth + Data Sync        │
└─────────────────────────────────────┘
              ↓ (Reads/Writes)
┌─────────────────────────────────────┐
│     Supabase (PostgreSQL)           │
│  Stores + Orders + Campaigns + Metrics│
└─────────────────────────────────────┘
```

---

## What the Frontend Does

### On Load

1. Check for token in URL
2. If token exists → save to localStorage → render Dashboard
3. If no token → render ConnectShopify

### ConnectShopify Page

- Input for shop URL
- Validation (must end in .myshopify.com)
- "Connect" button triggers: `POST /auth/shopify?shop=...`

### Dashboard

**Tab 1: Overview**
- Fetches `/api/metrics/summary?startDate=...&endDate=...`
- Displays:
  - Total Revenue (green card)
  - Ad Spend (red card)
  - Net Profit (blue card)
  - ACOS % (red/amber/green based on value)
  - ROAS x (red/amber/green based on value)
  - CAC $ (purple card)
  - Total Orders (count)

**Tab 2: Campaigns**
- Fetches `/api/campaigns/table?startDate=...&endDate=...`
- Displays table with columns:
  - Campaign Name
  - Spend ($)
  - Revenue ($)
  - ACOS (%) with badge color
  - ROAS (x) with badge color
  - Clicks
  - Impressions
  - CPC (Cost Per Click)

**Date Range Picker**
- Default: Last 7 days
- Presets: 7, 30, 90 days
- Custom: Drag slider 1-365 days

---

## Components in Detail

### MetricCard

Props:
- `title` - Display name
- `value` - Number to show
- `prefix` - Before number (e.g., "$")
- `suffix` - After number (e.g., "%")
- `color` - Card text color
- `trend` - Optional trend % (shows ↑/↓)

Example:
```jsx
<MetricCard
  title="ACOS"
  value={43.5}
  suffix="%"
  color={43.5 < 30 ? '#10b981' : '#ef4444'}
/>
```

### CampaignTable

Props:
- `campaigns` - Array of campaign objects
- `loading` - Boolean

Campaign object structure:
```javascript
{
  name: "Summer Sale",
  spend: 500.00,
  revenue: 2000.00,
  acos: 25.00,
  roas: 4.00,
  clicks: 150,
  impressions: 5000,
  cpc: 3.33,
  ctr: 3.00
}
```

### DateRangePicker

Props:
- `onDateChange` - Callback function that receives:
  ```javascript
  {
    startDate: "2024-05-01",
    endDate: "2024-05-31"
  }
  ```

---

## Styling

All components use **Shopify Polaris** components for consistent design:
- Automatic light/dark mode support
- Mobile responsive
- Accessible (WCAG 2.1 AA)

Custom inline styles used for layout flexibility:
- Padding/margins
- Colors (via Polaris tokens)
- Flex layouts

---

## Error Handling

### API Errors

Axios interceptor catches 401 responses:
```javascript
if (error.response?.status === 401) {
  // Clear auth and redirect to login
  localStorage.removeItem('profitdash_token');
  window.location.href = '/';
}
```

### Data Loading Errors

Wrapped in try-catch:
```javascript
try {
  const { data } = await apiClient.get(...);
  setData(data);
} catch (err) {
  setError(err.message);
}
```

Error is displayed in ErrorBanner component

---

## Production Checklist

- [ ] Backend deployed to Railway ✅
- [ ] Backend health check working ✅
- [ ] Shopify Partner Dashboard URLs updated ✅
- [ ] Environment variables in Railway set ✅
- [ ] .env file updated for frontend
- [ ] Frontend deployed to Vercel
- [ ] Vercel environment variables set
- [ ] Test OAuth flow end-to-end
- [ ] Test dashboard with real data
- [ ] Install app in test Shopify store
- [ ] Confirm data syncing daily

---

## Next Steps

1. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure .env**
   ```
   VITE_BACKEND_URL=https://profitdash-production.up.railway.app
   ```

3. **Deploy to Vercel**
   - Connect GitHub repo
   - Set environment variables
   - Click deploy

4. **Update Shopify Partner Dashboard**
   - App URL: `https://your-vercel-url`
   - This is an embedded app (add App Bridge in future)

5. **Test the full flow**
   - Install app in test store
   - Authorize Shopify OAuth
   - See dashboard data populate

---

## Troubleshooting

**App fails to load?**
→ Check browser console for errors
→ Verify VITE_BACKEND_URL is correct
→ Check backend is running and accessible

**Can't connect Shopify?**
→ Make sure shop URL ends in `.myshopify.com`
→ Check backend /auth/shopify route works
→ Verify Shopify Partner Dashboard URLs match

**No data showing?**
→ Check if cron job has run (daily at 2 AM UTC)
→ Verify tokens saved in Supabase
→ Check network tab for failed API calls

**CORS errors?**
→ Backend CORS middleware should allow your Vercel URL
→ If not, update backend CORS config

---

## File Sizes (Optimized)

- `dist/index.html` - ~1 KB
- `dist/assets/main.*.js` - ~150 KB (minified + gzipped)
- `dist/assets/main.*.css` - ~50 KB (Polaris styles)

Total: ~200 KB

---

You're ready to deploy! 🚀

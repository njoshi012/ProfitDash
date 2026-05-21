-- Stores (one row per Shopify merchant)
create table if not exists stores (
  id              uuid primary key default gen_random_uuid(),
  shop            text not null unique,
  access_token    text not null,
  meta_access_token text,
  meta_ad_account_id text,
  created_at      timestamptz default now()
);

-- Orders (synced from Shopify)
create table if not exists orders (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid references stores(id) on delete cascade,
  order_id    text not null,
  revenue     numeric(12,2) not null default 0,
  created_at  timestamptz not null,
  unique(store_id, order_id)
);

-- Meta campaigns (synced from Meta Ads API)
create table if not exists meta_campaigns (
  id              uuid primary key default gen_random_uuid(),
  store_id        uuid references stores(id) on delete cascade,
  campaign_id     text not null,
  campaign_name   text not null,
  spend           numeric(12,2) default 0,
  clicks          integer default 0,
  impressions     integer default 0,
  date            date not null,
  unique(store_id, campaign_id, date)
);

-- Daily aggregated metrics (pre-calculated)
create table if not exists daily_metrics (
  id          uuid primary key default gen_random_uuid(),
  store_id    uuid references stores(id) on delete cascade,
  spend       numeric(12,2) default 0,
  revenue     numeric(12,2) default 0,
  orders      integer default 0,
  acos        numeric(8,4),
  roas        numeric(8,4),
  profit      numeric(12,2),
  cac         numeric(12,2),
  date        date not null,
  unique(store_id, date)
);

-- Row-level security (each store sees only its own data)
alter table stores          enable row level security;
alter table orders          enable row level security;
alter table meta_campaigns  enable row level security;
alter table daily_metrics   enable row level security;

-- Indexes for common queries
create index on orders(store_id, created_at desc);
create index on meta_campaigns(store_id, date desc);
create index on daily_metrics(store_id, date desc);

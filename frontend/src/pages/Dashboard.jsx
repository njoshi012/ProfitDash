import React, { useState } from 'react';
import { Page, Layout, Card, Button, Tabs, Text, Spinner } from '@shopify/polaris';
import { useAuthStore } from '../hooks/useAuth';
import { useMetrics } from '../hooks/useMetrics';
import { useCampaigns } from '../hooks/useCampaigns';
import { MetricCard } from '../components/MetricCard';
import { CampaignTable } from '../components/CampaignTable';
import { DateRangePicker } from '../components/DateRangePicker';

export function Dashboard() {
  const { shop, logout } = useAuthStore();
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const [selectedTab, setSelectedTab] = useState(0);

  const { metrics, loading: metricsLoading } = useMetrics(dateRange.startDate, dateRange.endDate);
  const { campaigns, loading: campaignsLoading } = useCampaigns(dateRange.startDate, dateRange.endDate);

  const tabs = [
    { id: 'overview', content: '📊 Overview', panelID: 'overview-panel' },
    { id: 'campaigns', content: '📈 Campaigns', panelID: 'campaigns-panel' },
  ];

  return (
    <Page
      title="ProfitDash Dashboard"
      subtitle={`Analyzing metrics for ${shop}`}
      primaryAction={
        <Button destructive onClick={logout}>
          Logout
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '1rem', borderBottom: '1px solid #e0e0e0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="headingMd">Metrics Period</Text>
                <DateRangePicker onDateChange={setDateRange} />
              </div>
            </div>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
        </Layout.Section>

        {selectedTab === 0 && (
          <Layout.Section>
            {metricsLoading ? (
              <Card>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <Spinner accessibilityLabel="Loading" />
                </div>
              </Card>
            ) : metrics ? (
              <>
                <Layout>
                  <Layout.Section oneThird>
                    <MetricCard
                      title="Total Revenue"
                      value={metrics.totalRevenue}
                      prefix="$"
                      color="#10b981"
                    />
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <MetricCard
                      title="Ad Spend"
                      value={metrics.totalSpend}
                      prefix="$"
                      color="#ef4444"
                    />
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <MetricCard
                      title="Net Profit"
                      value={metrics.totalProfit}
                      prefix="$"
                      color="#3b82f6"
                    />
                  </Layout.Section>
                </Layout>

                <Layout>
                  <Layout.Section oneThird>
                    <MetricCard
                      title="ACOS"
                      value={metrics.avgAcos}
                      suffix="%"
                      color={metrics.avgAcos < 30 ? '#10b981' : metrics.avgAcos < 50 ? '#f59e0b' : '#ef4444'}
                    />
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <MetricCard
                      title="ROAS"
                      value={metrics.avgRoas}
                      suffix="x"
                      color={metrics.avgRoas > 3 ? '#10b981' : metrics.avgRoas > 2 ? '#f59e0b' : '#ef4444'}
                    />
                  </Layout.Section>
                  <Layout.Section oneThird>
                    <MetricCard
                      title="CAC"
                      value={metrics.avgCac}
                      prefix="$"
                      color="#8b5cf6"
                    />
                  </Layout.Section>
                </Layout>

                <Layout.Section>
                  <Card>
                    <div style={{ padding: '1.5rem' }}>
                      <Text variant="headingMd" as="h3">Orders</Text>
                      <div style={{ marginTop: '1rem', fontSize: '2rem', fontWeight: 'bold' }}>
                        {metrics.totalOrders}
                      </div>
                    </div>
                  </Card>
                </Layout.Section>
              </>
            ) : (
              <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  No data available. Please wait for the daily sync to complete.
                </div>
              </Card>
            )}
          </Layout.Section>
        )}

        {selectedTab === 1 && (
          <Layout.Section>
            {campaignsLoading ? (
              <Card>
                <div style={{ padding: '2rem', textAlign: 'center' }}>
                  <Spinner accessibilityLabel="Loading" />
                </div>
              </Card>
            ) : campaigns.length > 0 ? (
              <CampaignTable campaigns={campaigns} loading={campaignsLoading} />
            ) : (
              <Card>
                <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                  No campaigns found. Connect your Meta Ads account to see campaign data.
                </div>
              </Card>
            )}
          </Layout.Section>
        )}
      </Layout>
    </Page>
  );
}

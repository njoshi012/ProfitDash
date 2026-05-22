import React from 'react';
import { Page, Card, Button, Text, Layout } from '@shopify/polaris';
import { useAuthStore } from '../hooks/useAuth';

export function ConnectMeta() {
  const { loginWithMeta, logout } = useAuthStore();

  return (
    <Page
      title="Connect Meta Ads"
      backAction={{ onAction: logout }}
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Connect Meta Ads Account</h2>
              
              <p style={{ fontSize: '1rem', color: '#666', marginBottom: '2rem' }}>
                Link your Meta Ads account to automatically sync campaign data and calculate ROAS & ACOS metrics.
              </p>

              <Button
                primary
                size="large"
                onClick={loginWithMeta}
                fullWidth
              >
                🔗 Connect Meta Ads
              </Button>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
                <Text as="p" variant="bodySm" color="subdued">
                  ✅ We'll sync your campaign spend daily<br />
                  ✅ No manual uploads needed<br />
                  ✅ Automatic ROAS & ACOS calculation<br />
                </Text>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

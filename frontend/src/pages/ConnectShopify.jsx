import React, { useState } from 'react';
import { Page, Card, Button, TextField, Text, Layout, FormLayout } from '@shopify/polaris';
import { useAuthStore } from '../hooks/useAuth';

export function ConnectShopify() {
  const [shop, setShop] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginWithShopify, error, setError } = useAuthStore();

  const handleConnect = (e) => {
    e.preventDefault();
    
    if (!shop || !shop.includes('.myshopify.com')) {
      setError('Please enter a valid Shopify store URL (e.g., mystore.myshopify.com)');
      return;
    }

    setLoading(true);
    loginWithShopify(shop);
  };

  return (
    <Page title="ProfitDash">
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊 ProfitDash</h1>
              <p style={{ fontSize: '1.125rem', color: '#666', marginBottom: '2rem' }}>
                Track your ad spend and profit metrics in real-time
              </p>

              <FormLayout>
                <TextField
                  label="Shopify Store URL"
                  type="text"
                  value={shop}
                  onChange={setShop}
                  placeholder="mystore.myshopify.com"
                  autoComplete="off"
                  disabled={loading}
                  error={error}
                />

                <div style={{ marginTop: '1.5rem' }}>
                  <Button
                    primary
                    size="large"
                    onClick={handleConnect}
                    loading={loading}
                    fullWidth
                  >
                    Connect Shopify Store
                  </Button>
                </div>
              </FormLayout>

              <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e0e0e0' }}>
                <Text as="p" variant="bodySm" color="subdued">
                  🔒 Secure OAuth authentication<br />
                  📈 Real-time metrics from Shopify & Meta Ads<br />
                  💰 Track ACOS, ROAS, Profit & CAC<br />
                </Text>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

import React from 'react';
import { Banner } from '@shopify/polaris';

export function ErrorBanner({ message }) {
  return (
    <div style={{ padding: '1rem' }}>
      <Banner title="Error" status="critical">
        <p>{message}</p>
      </Banner>
    </div>
  );
}

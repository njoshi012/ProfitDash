import React from 'react';
import { Spinner } from '@shopify/polaris';

export function Loading() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f6f7f8',
    }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner accessibilityLabel="Loading" size="large" />
        <p style={{ marginTop: '1rem', color: '#666' }}>Loading ProfitDash...</p>
      </div>
    </div>
  );
}

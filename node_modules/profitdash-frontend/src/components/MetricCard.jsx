import React from 'react';
import { Card, Text } from '@shopify/polaris';

export function MetricCard({ title, value, prefix = '', suffix = '', trend = null, color = '#1F2937' }) {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value;

  return (
    <Card>
      <div style={{ padding: '1.5rem' }}>
        <Text variant="headingMd" as="h3" color="subdued">
          {title}
        </Text>
        <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <span style={{ fontSize: '2rem', fontWeight: 'bold', color }}>
            {prefix}{formattedValue}{suffix}
          </span>
          {trend && (
            <span style={{
              fontSize: '0.875rem',
              color: trend > 0 ? '#10b981' : '#ef4444',
            }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

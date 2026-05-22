import React from 'react';
import { IndexTable, Card, Text, Badge } from '@shopify/polaris';

export function CampaignTable({ campaigns, loading }) {
  const resourceName = {
    singular: 'campaign',
    plural: 'campaigns',
  };

  const rows = campaigns.map((campaign, idx) => (
    <IndexTable.Row id={idx} key={idx} position={idx}>
      <IndexTable.Cell>
        <Text variant="bodyMd" fontWeight="semibold">
          {campaign.name}
        </Text>
      </IndexTable.Cell>
      <IndexTable.Cell>${campaign.spend?.toFixed(2)}</IndexTable.Cell>
      <IndexTable.Cell>${campaign.revenue?.toFixed(2)}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge progress={Math.min(campaign.acos / 100, 1)} tone={campaign.acos < 30 ? 'success' : campaign.acos < 50 ? 'warning' : 'critical'}>
          {campaign.acos?.toFixed(2)}%
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Badge progress={Math.min(campaign.roas / 5, 1)} tone={campaign.roas > 3 ? 'success' : campaign.roas > 2 ? 'warning' : 'critical'}>
          {campaign.roas?.toFixed(2)}x
        </Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>{campaign.clicks}</IndexTable.Cell>
      <IndexTable.Cell>{campaign.impressions}</IndexTable.Cell>
      <IndexTable.Cell>${campaign.cpc?.toFixed(2)}</IndexTable.Cell>
    </IndexTable.Row>
  ));

  return (
    <Card>
      <IndexTable
        resourceName={resourceName}
        itemCount={campaigns.length}
        headings={[
          { title: 'Campaign' },
          { title: 'Spend' },
          { title: 'Revenue' },
          { title: 'ACOS' },
          { title: 'ROAS' },
          { title: 'Clicks' },
          { title: 'Impressions' },
          { title: 'CPC' },
        ]}
        rows={rows}
        selectable={false}
      />
    </Card>
  );
}

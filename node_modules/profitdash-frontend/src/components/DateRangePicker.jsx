import React, { useState } from 'react';
import { Button, Popover, RangeSlider, ButtonGroup, Text } from '@shopify/polaris';
import { formatISO, subDays, startOfDay, endOfDay } from 'date-fns';

export function DateRangePicker({ onDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState([7]); // Default 7 days

  const handlePreset = (days) => {
    const endDate = endOfDay(new Date());
    const startDate = startOfDay(subDays(endDate, days));
    
    onDateChange({
      startDate: formatISO(startDate).split('T')[0],
      endDate: formatISO(endDate).split('T')[0],
    });
    
    setIsOpen(false);
  };

  const getLabel = () => {
    if (range[0] === 7) return 'Last 7 days';
    if (range[0] === 30) return 'Last 30 days';
    if (range[0] === 90) return 'Last 90 days';
    return `Last ${range[0]} days`;
  };

  return (
    <Popover
      active={isOpen}
      activator={
        <Button onClick={() => setIsOpen(!isOpen)}>
          {getLabel()}
        </Button>
      }
      onClose={() => setIsOpen(false)}
    >
      <div style={{ padding: '1rem', minWidth: '300px' }}>
        <Text as="h3" variant="headingMd">Date Range</Text>
        
        <ButtonGroup fullWidth segmented>
          <Button
            pressed={range[0] === 7}
            onClick={() => { setRange([7]); handlePreset(7); }}
          >
            7 days
          </Button>
          <Button
            pressed={range[0] === 30}
            onClick={() => { setRange([30]); handlePreset(30); }}
          >
            30 days
          </Button>
          <Button
            pressed={range[0] === 90}
            onClick={() => { setRange([90]); handlePreset(90); }}
          >
            90 days
          </Button>
        </ButtonGroup>

        <div style={{ marginTop: '1rem' }}>
          <Text as="label" variant="bodySm">Custom range: {range[0]} days</Text>
          <RangeSlider
            label=""
            min={1}
            max={365}
            step={1}
            value={range}
            onChange={setRange}
            onAfterChange={() => handlePreset(range[0])}
          />
        </div>
      </div>
    </Popover>
  );
}

import { useState, useEffect } from 'react';
import apiClient from '../utils/api';

export const useMetrics = (startDate, endDate) => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const { data } = await apiClient.get(`/api/metrics/summary?${params}`);
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [startDate, endDate]);

  return { metrics, loading, error };
};

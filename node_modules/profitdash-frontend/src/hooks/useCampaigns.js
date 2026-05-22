import { useState, useEffect } from 'react';
import apiClient from '../utils/api';

export const useCampaigns = (startDate, endDate) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const { data } = await apiClient.get(`/api/campaigns/table?${params}`);
        setCampaigns(data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [startDate, endDate]);

  return { campaigns, loading, error };
};

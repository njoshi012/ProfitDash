import React, { useEffect } from 'react';
import '@shopify/polaris/build/esm/styles.css';

import { useAuthStore } from './hooks/useAuth';
import { Dashboard } from './pages/Dashboard';
import { ConnectShopify } from './pages/ConnectShopify';
import { ConnectMeta } from './pages/ConnectMeta';
import { Loading } from './components/Loading';
import { ErrorBanner } from './components/ErrorBanner';

function App() {
  const { isAuthenticated, isLoading, error, getTokenFromURL } = useAuthStore();

  useEffect(() => {
    // Check for token in URL after OAuth callback
    getTokenFromURL();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
     <>
      {error && <ErrorBanner message={error} />}
      
      {!isAuthenticated ? (
        <ConnectShopify />
      ) : (
        <Dashboard />
      )}
    </>
  );
}

export default App;

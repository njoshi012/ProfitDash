import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('profitdash_token') || null,
  shop: localStorage.getItem('profitdash_shop') || null,
  isAuthenticated: !!localStorage.getItem('profitdash_token'),
  isLoading: false,
  error: null,

  // Extract token from URL after Shopify OAuth callback
  getTokenFromURL: () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const shop = params.get('shop');

    if (token && shop) {
      localStorage.setItem('profitdash_token', token);
      localStorage.setItem('profitdash_shop', shop);
      set({ token, shop, isAuthenticated: true });
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  },

  // Login with Shopify
  loginWithShopify: (shop) => {
    set({ isLoading: true, error: null });
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    window.location.href = `${backendURL}/auth/shopify?shop=${shop}`;
  },

  // Login with Meta
  loginWithMeta: () => {
    set({ isLoading: true, error: null });
    const backendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';
    const shop = localStorage.getItem('profitdash_shop');
    window.location.href = `${backendURL}/auth/meta?shop=${shop}`;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('profitdash_token');
    localStorage.removeItem('profitdash_shop');
    set({ token: null, shop: null, isAuthenticated: false });
    window.location.href = '/';
  },

  // Set error
  setError: (error) => set({ error }),

  // Clear error
  clearError: () => set({ error: null }),
}));

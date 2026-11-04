import axios from 'axios';

// Backend API URL (Beta Web Backend for contacts, jobs, applications, reports, newsletter, etc.)
export const getBackendURL = () => {
  if (import.meta.env.VITE_BACKEND_API_BASE) {
    return import.meta.env.VITE_BACKEND_API_BASE;
  }
  // If VITE_API_BASE is provided and does NOT point to bnxmail/b2auth, treat it as backend
  if (import.meta.env.VITE_API_BASE && !import.meta.env.VITE_API_BASE.includes('bnxmail')) {
    return import.meta.env.VITE_API_BASE;
  }
  return import.meta.env.DEV || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8081'
    : 'https://apply.beta-softnet.com';
};

// Auth / SSO API URL (BNXMail / B2Auth OAuth gateway for token exchange, user profile, etc.)
export const getAuthURL = () => {
  if (import.meta.env.VITE_AUTH_API_BASE) {
    return import.meta.env.VITE_AUTH_API_BASE;
  }
  if (import.meta.env.VITE_API_BASE && import.meta.env.VITE_API_BASE.includes('bnxmail')) {
    return import.meta.env.VITE_API_BASE;
  }
  return 'https://api.bnxmail.com';
};

// Default Axios instance
const api = axios.create({
  baseURL: getBackendURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: dynamic route routing and JWT authorization injection
api.interceptors.request.use(
  (config) => {
    const url = config.url || '';

    // Check if the request is an Auth/SSO endpoint
    const isAuthEndpoint =
      url.startsWith('/api/oauth') ||
      url.startsWith('/api/users') ||
      url.startsWith('/api/auth');

    // Route to the appropriate base URL if not already an absolute URL
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      config.baseURL = isAuthEndpoint ? getAuthURL() : getBackendURL();
    }

    // Public endpoints that must never fail due to an invalid/expired user token
    const isPublicEndpoint =
      url.startsWith('/api/contact') ||
      url.startsWith('/api/contacts') ||
      url.startsWith('/api/newsletter');

    const token = localStorage.getItem('beta_token');
    const isMock =
      token === 'mock_jwt_token_for_admin' ||
      token ===
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjoxODA2MzAwMDAwfQ.bW9ja19zaWduYXR1cmVfdmFsdWU';

    if (token && !isMock && !isPublicEndpoint) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (isPublicEndpoint && config.headers['Authorization']) {
      delete config.headers['Authorization'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

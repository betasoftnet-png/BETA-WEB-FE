import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('beta_token');
    const username = localStorage.getItem('beta_username');
    const role = localStorage.getItem('beta_role');
    const email = localStorage.getItem('beta_email');
    const fullName = localStorage.getItem('beta_fullName');
    const firstName = localStorage.getItem('beta_firstName');
    const lastName = localStorage.getItem('beta_lastName');

    if (token && username && role) {
      setUser({ username, role, email, fullName, firstName, lastName });
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password) => {
    try {
      // Step 1: Request OAuth Token with password grant
      const tokenResponse = await api.post('/api/oauth/token', {
        grantType: 'password',
        username,
        password,
        clientId: import.meta.env.VITE_CLIENT_ID || 'beta_website',
        clientSecret: import.meta.env.VITE_CLIENT_SECRET || 'secure-beta-secret-2026'
      });

      if (tokenResponse.data && tokenResponse.data.success) {
        const accessToken = tokenResponse.data.data.access_token;
        localStorage.setItem('beta_token', accessToken);

        // Step 2: Fetch User Profile
        const profileResponse = await api.get('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (profileResponse.data && profileResponse.data.success) {
          const { username: profileUsername, accountType, email, fullName } = profileResponse.data.data;
          const role = accountType || 'ROLE_ADMIN';

          localStorage.setItem('beta_username', profileUsername || username);
          localStorage.setItem('beta_role', role);
          localStorage.setItem('beta_email', email || username);
          localStorage.setItem('beta_fullName', fullName || 'Administrator');

          setUser({ username: profileUsername || username, role, email: email || username, fullName: fullName || 'Administrator' });
          return { success: true };
        }
      }
    } catch (err) {
      console.warn('OAuth password grant failed. Falling back to local mock authentication.', err);
    }

    // Fallback Mock Authentication (for local offline development)
    if (username === 'admin@betasoftnet.com' && password === 'admin123') {
      const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJST0xFX0FETUlOIiwiZXhwIjoxODA2MzAwMDAwfQ.bW9ja19zaWduYXR1cmVfdmFsdWU';
      const role = 'ROLE_ADMIN';
      const fullName = 'Administrator';
      const email = 'admin@betasoftnet.com';
      
      localStorage.setItem('beta_token', mockToken);
      localStorage.setItem('beta_username', username);
      localStorage.setItem('beta_role', role);
      localStorage.setItem('beta_email', email);
      localStorage.setItem('beta_fullName', fullName);
      
      setUser({ username, role, email, fullName });
      return { success: true };
    }

    return { 
      success: false, 
      message: 'Invalid username or password' 
    };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('beta_token');
    localStorage.removeItem('beta_username');
    localStorage.removeItem('beta_role');
    localStorage.removeItem('beta_email');
    localStorage.removeItem('beta_fullName');
    localStorage.removeItem('beta_firstName');
    localStorage.removeItem('beta_lastName');
    setUser(null);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await api.post('/api/auth/refresh-token');
      const { token, role, username } = response.data;
      localStorage.setItem('beta_token', token);
      setUser({ username, role });
    } catch (error) {
      logout();
    }
  }, [logout]);

  const loginWithSSO = useCallback((token, username, role, email = '', fullName = '', firstName = '', lastName = '') => {
    localStorage.setItem('beta_token', token);
    localStorage.setItem('beta_username', username);
    localStorage.setItem('beta_role', role);
    localStorage.setItem('beta_email', email);
    localStorage.setItem('beta_fullName', fullName);
    localStorage.setItem('beta_firstName', firstName);
    localStorage.setItem('beta_lastName', lastName);
    
    setUser({ username, role, email, fullName, firstName, lastName });
  }, []);

  const redirectToSSO = useCallback((redirectPath = '/') => {
    const clientId = import.meta.env.VITE_CLIENT_ID || 'beta_website';
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || window.location.origin;
    const b2authUrl = import.meta.env.VITE_B2AUTH_URL || 'https://b2auth.com';
    const state = Math.random().toString(36).substring(2, 15);
    
    localStorage.setItem('sso_redirect_to', redirectPath);
    window.location.href = `${b2authUrl}/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshToken, loginWithSSO, redirectToSSO }}>
      {children}
    </AuthContext.Provider>
  );
};

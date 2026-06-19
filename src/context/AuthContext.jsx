import React, { createContext, useState, useEffect } from 'react';
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

  const login = async (username, password) => {
    if (username === 'admin@betasoftnet.com' && password === 'admin123') {
      const token = 'mock_jwt_token_for_admin';
      const role = 'ROLE_ADMIN';
      const fullName = 'Administrator';
      const email = 'admin@betasoftnet.com';
      
      localStorage.setItem('beta_token', token);
      localStorage.setItem('beta_username', username);
      localStorage.setItem('beta_role', role);
      localStorage.setItem('beta_email', email);
      localStorage.setItem('beta_fullName', fullName);
      
      setUser({ username, role, email, fullName });
      return { success: true };
    } else {
      return { 
        success: false, 
        message: 'Invalid username or password' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('beta_token');
    localStorage.removeItem('beta_username');
    localStorage.removeItem('beta_role');
    localStorage.removeItem('beta_email');
    localStorage.removeItem('beta_fullName');
    localStorage.removeItem('beta_firstName');
    localStorage.removeItem('beta_lastName');
    setUser(null);
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/api/auth/refresh-token');
      const { token, role, username } = response.data;
      localStorage.setItem('beta_token', token);
      setUser({ username, role });
    } catch (error) {
      logout();
    }
  };

  const loginWithSSO = (token, username, role, email = '', fullName = '', firstName = '', lastName = '') => {
    localStorage.setItem('beta_token', token);
    localStorage.setItem('beta_username', username);
    localStorage.setItem('beta_role', role);
    localStorage.setItem('beta_email', email);
    localStorage.setItem('beta_fullName', fullName);
    localStorage.setItem('beta_firstName', firstName);
    localStorage.setItem('beta_lastName', lastName);
    
    setUser({ username, role, email, fullName, firstName, lastName });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshToken, loginWithSSO }}>
      {children}
    </AuthContext.Provider>
  );
};

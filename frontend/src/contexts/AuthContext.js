import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set auth token for all requests
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['x-auth-token'] = token;
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  // Load user on initial render if token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // For development without backend
        setUser({
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin'
        });
        setLoading(false);
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  // Login user
  const login = async (email, password) => {
    try {
      // For development without backend
      console.log('Login attempt with:', email, password);
      
      // Simulate successful login
      const mockToken = 'mock-jwt-token-12345';
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      
      setUser({
        id: '1',
        name: 'Admin User',
        email: email,
        role: 'admin'
      });
      
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
      return false;
    }
  };

  // Register user
  const register = async (name, email, password) => {
    try {
      // For development without backend
      console.log('Register attempt with:', name, email, password);
      
      // Simulate successful registration
      const mockToken = 'mock-jwt-token-12345';
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      
      setUser({
        id: '1',
        name: name,
        email: email,
        role: 'admin'
      });
      
      return true;
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Clear error
  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    clearError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
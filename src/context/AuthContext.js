import React, { createContext, useContext, useState } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = async (username, password) => {
    try {
      const response = await api.post('/login', { username, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      setIsAuthenticated(true);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.error || 'Invalid credentials');
    }
  };

  const register = async (username, email, password) => {
    try {
      console.log('Registering with:', { username, email, password });
      const response = await api.post('/register', { username, email, password });
      console.log('Registration response:', response.data);
      
      if (response.data.message === 'User created successfully') {
        // After successful registration, login with username and password
        return await login(username, password);
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        throw new Error(error.response.data.error || 'Registration failed');
      } else if (error.request) {
        throw new Error('No response from server. Please try again.');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

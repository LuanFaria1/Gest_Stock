import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import authService from '../services/authService';
import apiClient from '../services/api'; // Import apiClient to update headers on login/logout

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [isLoading, setIsLoading] = useState(true); // Start loading until initial check is done
  const [error, setError] = useState(null);

  // Function to update API client headers
  const updateApiClientHeaders = useCallback((currentToken) => {
    if (currentToken) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  }, []);

  // Initial check on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        updateApiClientHeaders(storedToken);
        setIsAuthenticated(true);
        try {
          // Optional: Fetch user data if needed on load
          // const userData = await authService.getCurrentUser();
          // setUser(userData.seller);
          // For now, just assume authenticated if token exists
          setUser({ token: storedToken }); // Placeholder user object
        } catch (err) {
          console.error("Erro ao verificar token inicial:", err);
          // If token is invalid, clear it
          localStorage.removeItem('authToken');
          setToken(null);
          setIsAuthenticated(false);
          setUser(null);
          updateApiClientHeaders(null);
        }
      } else {
        updateApiClientHeaders(null);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [updateApiClientHeaders]);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      if (data.token) {
        localStorage.setItem('authToken', data.token);
        setToken(data.token);
        setUser(data.seller || { token: data.token }); // Use seller data if available
        setIsAuthenticated(true);
        updateApiClientHeaders(data.token);
        setIsLoading(false);
        return true; // Indicate success
      } else {
        throw new Error("Token não recebido do backend");
      }
    } catch (err) {
      console.error("Falha no login:", err);
      setError(err.erro || err.message || 'Erro desconhecido no login');
      localStorage.removeItem('authToken');
      setToken(null);
      setUser(null);
      setIsAuthenticated(false);
      updateApiClientHeaders(null);
      setIsLoading(false);
      return false; // Indicate failure
    }
  };

  const logout = () => {
    authService.logout(); // Clears localStorage
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
    updateApiClientHeaders(null);
    // Optionally redirect using useNavigate in the component calling logout
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};


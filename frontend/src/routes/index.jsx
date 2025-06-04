import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ActivateAccountPage from '../pages/ActivateAccountPage';

import ProductListPage from '../pages/ProductListPage';
import ProductFormPage from '../pages/ProductFormPage';
import ProductDetailPage from '../pages/ProductDetailPage';

import { useAuth } from '../contexts/AuthContext';

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/produtos" replace /> : <LoginPage />} />
        <Route path="/cadastro" element={isAuthenticated ? <Navigate to="/produtos" replace /> : <RegisterPage />} />
        <Route path="/ativar-conta" element={isAuthenticated ? <Navigate to="/produtos" replace /> : <ActivateAccountPage />} />

        {/* Private Routes */}
        {isAuthenticated && (
          <>
            <Route path="/produtos" element={<ProductListPage />} />
            <Route path="/produtos/novo" element={<ProductFormPage />} />
            <Route path="/produtos/:id" element={<ProductDetailPage />} />
            <Route path="/produtos/:id/editar" element={<ProductFormPage />} />
          </>
        )}

        {/* Default route: redirect depending on auth status */}
        <Route
          path="*"
          element={isAuthenticated ? <Navigate to="/produtos" replace /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default AppRoutes;

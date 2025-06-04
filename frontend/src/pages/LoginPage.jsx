import React from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import '../styles/login.css'; // <-- Importa o CSS específico da página de login

function LoginPage() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login do Seller</h2>
        <LoginForm />
        <p className="login-footer">
          Não tem uma conta?
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

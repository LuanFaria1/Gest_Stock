import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { useSeller } from '../contexts/SellerContext';
import '../styles/register.css'; // Importa o CSS exclusivo de cadastro

function RegisterPage() {
  const { registrationStatus, registeredSeller, resetStatus } = useSeller();
  const navigate = useNavigate();

  useEffect(() => {
    resetStatus();
    return () => resetStatus();
  }, [resetStatus]);

  useEffect(() => {
    if (registrationStatus === 'success' && registeredSeller) {
      navigate('/ativar-conta', { state: { celular: registeredSeller.celular } });
    }
  }, [registrationStatus, registeredSeller, navigate]);

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Criar Conta</h2>
        <RegisterForm />
        <p className="register-footer">
          Já tem uma conta?
          <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

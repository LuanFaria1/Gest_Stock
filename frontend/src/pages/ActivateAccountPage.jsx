// src/pages/ActivateAccountPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useSeller } from '../contexts/SellerContext';
import '../styles/active.css'; // Importa o CSS específico da página de ativação

function ActivateAccountPage() {
  const [codigo, setCodigo] = useState('');
  const [formError, setFormError] = useState('');
  const { activateSeller, activationStatus, error: apiError, resetStatus } = useSeller();

  const location = useLocation();
  const navigate = useNavigate();
  const celular = location.state?.celular;

  const memoizedResetStatus = useCallback(resetStatus, []);
  useEffect(() => {
    memoizedResetStatus();
    return () => memoizedResetStatus();
  }, [memoizedResetStatus]);

  useEffect(() => {
    if (activationStatus === 'success') {
      navigate('/login', { replace: true });
    }
  }, [activationStatus, navigate]);

  useEffect(() => {
    if (!celular) {
      setFormError('Número de celular não encontrado. <a href="/cadastro">Retorne ao cadastro</a> para tentar novamente.');
    }
  }, [celular]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!codigo || codigo.length !== 4 || !/^[0-9]+$/.test(codigo)) {
      setFormError('Por favor, insira o código de 4 dígitos numéricos recebido.');
      return;
    }

    if (!celular) {
      setFormError('Erro: Celular não disponível para ativação.');
      return;
    }

    try {
      await activateSeller({ celular, codigo });
    } catch (err) {
      console.error("Erro capturado no handleSubmit do ActivateAccountPage:", err);
    }
  };

  return (
    <div className="activate-page">
      <div className="activate-card">
        <h1 className="activate-title">Ativar Conta</h1>
        <p className="activate-instructions">
          Insira o código enviado para:
          <br />
          <span className="celular">{celular || 'Não informado'}</span>
        </p>

        <form onSubmit={handleSubmit} className="activate-form">
          {formError && (
            <p
              className="form-error"
              dangerouslySetInnerHTML={{ __html: formError }}
            />
          )}

          {activationStatus === 'error' && apiError && (
            <p className="form-error">
              Erro: {apiError?.erro || apiError?.message || 'Erro desconhecido.'}
            </p>
          )}

          <input
            type="text"
            name="codigo"
            id="codigo"
            inputMode="numeric"
            pattern="[0-9]{4}"
            maxLength="4"
            value={codigo}
            onChange={(e) =>
              setCodigo(e.target.value.replace(/[^0-9]/g, '').slice(0, 4))
            }
            placeholder="0000"
            className="codigo-input"
            required
          />

          <button
            type="submit"
            disabled={activationStatus === 'loading' || !celular}
            className="activate-button"
          >
            {activationStatus === 'loading' ? 'Ativando...' : 'Ativar Conta'}
          </button>
        </form>

        <div className="activate-footer">
          Não recebeu o código?
          <Link to="/cadastro" className="footer-link">Refazer cadastro</Link>
        </div>
      </div>
    </div>
  );
}

export default ActivateAccountPage;

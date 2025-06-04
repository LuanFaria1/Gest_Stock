import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LoginForm() {
  const [formData, setFormData] = useState({
    email: '',
    senha: '',
  });
  const [formError, setFormError] = useState('');
  const { login, isLoading, error: apiError } = useAuth();
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.email || !formData.senha) {
      setFormError('E-mail e senha são obrigatórios.');
      return;
    }

    const success = await login(formData);

    if (success) {
      navigate('/produtos'); // Redirect to product list on successful login
    } else {
      // Error is handled by the context and displayed below
      setFormError(apiError || 'Falha no login. Verifique suas credenciais ou se a conta está ativa.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Login do Seller</h2>

      {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
      {/* Display API error if login fails and formError is not set */}
      {!formError && apiError && (
        <p className="text-red-500 text-sm text-center">Erro: {apiError}</p>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="senha" className="block text-sm font-medium text-gray-700">Senha</label>
        <input
          type="password"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

export default LoginForm;


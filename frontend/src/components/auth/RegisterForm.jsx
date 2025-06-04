import React, { useState } from 'react';
import { useSeller } from '../../contexts/SellerContext';

function RegisterForm({ onRegistrationSuccess }) {
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    email: '',
    celular: '',
    senha: '',
    confirmarSenha: '',
  });
  const [formError, setFormError] = useState('');
  const { registerSeller, registrationStatus, error: apiError } = useSeller();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (formData.senha !== formData.confirmarSenha) {
      setFormError('As senhas não coincidem.');
      return;
    }

    // Basic frontend validation (can be expanded)
    if (!formData.nome || !formData.cnpj || !formData.email || !formData.celular || !formData.senha) {
        setFormError('Todos os campos são obrigatórios.');
        return;
    }

    // Remove confirmarSenha before sending to API
    const { confirmarSenha, ...sellerData } = formData;

    try {
      await registerSeller(sellerData);
      // onRegistrationSuccess callback will be called by the Page component
      // based on the registrationStatus change
    } catch (err) {
      // API error is handled by the context and displayed below
      setFormError(apiError || 'Falha no registro. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-6">Cadastro de Mini Mercado</h2>

      {formError && <p className="text-red-500 text-sm text-center">{formError}</p>}
      {registrationStatus === 'error' && apiError && (
        <p className="text-red-500 text-sm text-center">Erro da API: {typeof apiError === 'string' ? apiError : apiError.erro || 'Erro desconhecido'}</p>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome do Mini Mercado</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">CNPJ</label>
        <input
          type="text" // Consider using a mask library later
          id="cnpj"
          name="cnpj"
          value={formData.cnpj}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

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
        <label htmlFor="celular" className="block text-sm font-medium text-gray-700">Celular (com DDD, ex: +5511999998888)</label>
        <input
          type="tel" // Consider using a mask library later
          id="celular"
          name="celular"
          value={formData.celular}
          onChange={handleChange}
          required
          placeholder="+5511999998888"
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
          minLength="6" // Example validation
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
        <input
          type="password"
          id="confirmarSenha"
          name="confirmarSenha"
          value={formData.confirmarSenha}
          onChange={handleChange}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={registrationStatus === 'loading'}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {registrationStatus === 'loading' ? 'Registrando...' : 'Registrar'}
      </button>
    </form>
  );
}

export default RegisterForm;


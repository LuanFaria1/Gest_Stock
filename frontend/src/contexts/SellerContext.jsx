import React, { createContext, useState, useContext, useCallback } from 'react';
import sellerService from '../services/sellerService';

const SellerContext = createContext(null);

export const SellerProvider = ({ children }) => {
  const [registrationStatus, setRegistrationStatus] = useState('idle'); // idle, loading, success, error
  const [activationStatus, setActivationStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState(null);
  const [registeredSeller, setRegisteredSeller] = useState(null); // Store seller data after registration
  const [activatedSeller, setActivatedSeller] = useState(null); // Store seller data after activation

  const registerSeller = useCallback(async (sellerData) => {
    setRegistrationStatus('loading');
    setError(null);
    setRegisteredSeller(null);
    try {
      const response = await sellerService.register(sellerData);
      setRegisteredSeller(response.seller);
      setRegistrationStatus('success');
      // Optionally return data or true for success indication
      return response; 
    } catch (err) {
      console.error("Erro no registro do Seller:", err);
      setError(err.erro || err.message || 'Erro desconhecido no registro');
      setRegistrationStatus('error');
      // Optionally return false or throw error
      throw err; 
    }
  }, []);

  const activateSeller = useCallback(async (activationData) => {
    setActivationStatus('loading');
    setError(null);
    setActivatedSeller(null);
    try {
      const response = await sellerService.activate(activationData);
      setActivatedSeller(response.seller);
      setActivationStatus('success');
      // Optionally return data or true for success indication
      return response;
    } catch (err) {
      console.error("Erro na ativação do Seller:", err);
      setError(err.erro || err.message || 'Erro desconhecido na ativação');
      setActivationStatus('error');
      // Optionally return false or throw error
      throw err;
    }
  }, []);

  // Function to reset status, useful for navigating away or retrying
  const resetStatus = useCallback(() => {
    setRegistrationStatus('idle');
    setActivationStatus('idle');
    setError(null);
  }, []);

  return (
    <SellerContext.Provider value={{
      registrationStatus,
      activationStatus,
      error,
      registeredSeller,
      activatedSeller,
      registerSeller,
      activateSeller,
      resetStatus
    }}>
      {children}
    </SellerContext.Provider>
  );
};

export const useSeller = () => {
  const context = useContext(SellerContext);
  if (context === undefined) {
    throw new Error('useSeller deve ser usado dentro de um SellerProvider');
  }
  return context;
};


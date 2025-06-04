import React from 'react';
import AppRoutes from './routes'; // Import the router configuration
import { AuthProvider } from './contexts/AuthContext';
import { SellerProvider } from './contexts/SellerContext';
import { ProductProvider } from './contexts/ProductContext';
import { SalesProvider } from './contexts/SalesContext';

function App() {
  return (
    // Wrap the entire application with all necessary context providers
    // The order might matter if contexts depend on each other (e.g., Product depends on Auth)
    <AuthProvider>
      <SellerProvider>
        <ProductProvider>
          <SalesProvider>
            {/* AppRoutes contains the BrowserRouter and Routes setup */}
            <AppRoutes />
          </SalesProvider>
        </ProductProvider>
      </SellerProvider>
    </AuthProvider>
  );
}

export default App;


import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/produtos" className="font-bold text-xl">
              GestStock
            </Link>
            {/* Add other navigation links here if needed */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/produtos"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Meus Produtos
                </Link>
                {/* Link to add product */}
                 <Link
                  to="/produtos/novo"
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Cadastrar Produto
                </Link>
                {/* Add other links like Sales later */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Display user info if available */}
              {user && (
                <span className="mr-3 text-sm">Olá, {user.nome || user.email || 'Seller'}</span>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
          {/* Mobile menu button (optional) */}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


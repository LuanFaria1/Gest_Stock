import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renders the child route's element
import Navbar from './Navbar';

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main>
        {/* The content of the nested route will be rendered here */}
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Outlet /> 
        </div>
      </main>
      {/* Optional Footer can be added here */}
    </div>
  );
}

export default MainLayout;


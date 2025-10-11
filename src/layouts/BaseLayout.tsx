// src/layouts/BaseLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // CRITICAL: Import Outlet
import Footer from '../components/Footer';
import Header from '../components/Header';
import AdBanner from '../components/AdBanner';

// FIX: Remove the explicit 'children' prop from the function signature
const BaseLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <AdBanner />
    
    {/* CRITICAL FIX: Use <Outlet /> to render the nested route content */}
    <main className="flex-grow p-4">
        <Outlet /> 
    </main>
    
    <Footer />
  </div>
);

export default BaseLayout;

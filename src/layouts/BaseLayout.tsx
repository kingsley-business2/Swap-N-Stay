// ========================== src/layouts/BaseLayout.tsx ==========================
import React from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import AdBanner from '../components/AdBanner';

const BaseLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <AdBanner />
    <main className="flex-grow p-4">{children}</main>
    <Footer />
  </div>
);

export default BaseLayout;

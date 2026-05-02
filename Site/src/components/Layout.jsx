import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from './Header';
import Footer from './Footer';
import AuthModal from './ModalAuth';

const Layout = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="bg-[#0B0C10] min-h-screen font-sans">
      <Header onOpenLogin={() => setIsAuthOpen(true)} />
      <main className="pt-20">
        <Outlet context={{ onOpenLogin: () => setIsAuthOpen(true) }} />
      </main>
      <Footer />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default Layout;

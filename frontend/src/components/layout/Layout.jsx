import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useAuthStore } from '../../stores/authStore';

export default function Layout({ children }) {
  const { fetchCurrentUser } = useAuthStore();

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

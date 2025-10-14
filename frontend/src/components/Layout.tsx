import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  children: ReactNode;
}

export function Layout({ onNavigate, currentPage, children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header onNavigate={onNavigate} currentPage={currentPage} />
      {children}
      <Footer />
    </div>
  );
}
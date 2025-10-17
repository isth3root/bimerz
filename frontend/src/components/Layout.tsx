import type { ReactNode } from 'react';
import { Helmet } from "react-helmet";
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  children: ReactNode;
}

export function Layout({ onNavigate, currentPage, children }: LayoutProps) {
  const defaultTitle = 'بیمه البرز | Bimerz';
  const defaultDescription = 'خرید و مقایسه بیمه خودرو، بدنه و ثالث فقط با چند کلیک در بیمرز.';

  let pageTitle = defaultTitle;
  const pageDescription = defaultDescription;

  // Customize title and description per route
  if (currentPage === 'blogs') pageTitle = 'وبلاگ | بیمرز';
  if (currentPage.startsWith('blogs/')) pageTitle = 'جزئیات مقاله | بیمرز';
  if (currentPage === 'about') pageTitle = 'درباره ما | بیمرز';


  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content="/logo.png" />
      </Helmet>
      <Header onNavigate={onNavigate} currentPage={currentPage} />
      {children}
      <Footer />
    </div>
  );
}
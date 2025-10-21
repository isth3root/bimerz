import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from "sonner";
import { BlogSection } from './components/BlogSection';
import RulesSection from './components/RulesSection';
import { FAQSection } from './components/FAQSection';
import { LoginPage } from './components/LoginPage';
import { NotFound } from './components/NotFound';
import { Layout } from './components/Layout';
import { useAuth } from './contexts/AuthContext';

const Blogs = lazy(() => import('./components/Blogs'));
const BlogDetail = lazy(() => import('./components/BlogDetail'));
const CustomerDashboard = lazy(() => import('./components/CustomerDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ServerStatusPage = lazy(() => import('./components/ServerStatusPage'));
const AboutUs = lazy(() => import('./components/AboutUs'));
const YaqutAlborz = lazy(() => import('./components/YaqutAlborz'));
const OnlineDamage = lazy(() => import('./components/OnlineDamage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const { userType, login, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return <div className='min-h-screen flex items-center justify-center'>در حال بارگذاری...</div>;
  }

  const handleNavigate = (page: string) => {
    if (page === 'rules') {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById('rules-section');
          if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const element = document.getElementById('rules-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (page.startsWith('/')) {
      navigate(page);
    } else {
      navigate('/' + page);
    }
  };

  const handleLogin = (data: { username: string; role: 'customer' | 'admin' | 'admin-2' | 'admin-3' }) => {
    login(data);
    navigate(data.role === 'customer' ? '/customer-dashboard' : '/admin-dashboard');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const currentPage = location.pathname.slice(1) || 'home';

  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>}>
        <Routes>
      <Route path="/" element={
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
          <OnlineDamage onNavigate={handleNavigate} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <BlogSection />
          </motion.div>
          <motion.div
            id="rules-section"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <RulesSection />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FAQSection />
          </motion.div>
        </Layout>
      } />
          <Route path="/login" element={
            isAuthenticated ?
              (userType === 'customer' ? <Navigate to="/customer-dashboard" replace /> : <Navigate to="/admin-dashboard" replace />)
              : <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />
          } />
          <Route path="/customer-dashboard" element={
            isAuthenticated && userType === 'customer' ?
              <CustomerDashboard onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
          } />
          <Route path="/admin-dashboard" element={
            isAuthenticated && userType && userType !== 'customer' ?
              <AdminDashboard onLogout={handleLogout} /> :
              <Navigate to="/login" replace />
          } />
          <Route path="/server-status" element={
            isAuthenticated && userType === 'admin' ?
              <ServerStatusPage /> :
              <Navigate to="/login" replace />
          } />
      <Route path="/about" element={
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
          <AboutUs />
        </Layout>
      } />
      <Route path="/yaqut-alborz" element={
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
          <YaqutAlborz />
        </Layout>
      } />
      <Route path="/blogs" element={
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Blogs />
          </motion.div>
        </Layout>
      } />
      <Route path="/blogs/:id" element={
        <Layout onNavigate={handleNavigate} currentPage={currentPage}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BlogDetail />
          </motion.div>
        </Layout>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </Suspense>
  </>
);
}

export default function App() {
  return (
    <BrowserRouter basename='/'>
      <AppContent />
    </BrowserRouter>
  );
}
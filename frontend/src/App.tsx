import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from "sonner";
import { Header } from './components/Header';
import { BlogSection } from './components/BlogSection';
import RulesSection from './components/RulesSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { CustomerDashboard } from './components/CustomerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ContactUs } from './components/ContactUs';
import { AboutUs } from './components/AboutUs';
import { NotFound } from './components/NotFound';
import { Blogs } from './components/Blogs';
import { BlogDetail } from './components/BlogDetail';

type UserType = 'customer' | 'admin' | 'admin-2' | 'admin-3' | null;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [userType, setUserType] = useState<UserType>(() => {
    const saved = localStorage.getItem('userType');
    return saved as UserType || null;
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (page: string) => {
    navigate(page);
  };

  const handleLogin = (type: 'customer' | 'admin' | 'admin-2' | 'admin-3') => {
    setUserType(type);
    localStorage.setItem('userType', type);
    navigate(type === 'customer' ? '/customer-dashboard' : '/admin-dashboard');
  };

  const handleLogout = () => {
    setUserType(null);
    localStorage.removeItem('userType');
    navigate('/');
  };

  const currentPage = location.pathname.slice(1) || 'home';

  return (
    <>
      <Toaster position="top-center" />
      <ScrollToTop />
      <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-white">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <BlogSection />
          </motion.div>
          <motion.div
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
          <Footer />
        </div>
      } />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />} />
      <Route path="/customer-dashboard" element={
        userType === 'customer' ? <CustomerDashboard onLogout={handleLogout} /> : <NotFound />
      } />
      <Route path="/admin-dashboard" element={
        userType && userType !== 'customer' ? <AdminDashboard onLogout={handleLogout} /> : <NotFound />
      } />
      <Route path="/contact" element={
        <div className="min-h-screen bg-white">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <ContactUs />
          <Footer />
        </div>
      } />
      <Route path="/about" element={
        <div className="min-h-screen bg-white">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <AboutUs />
          <Footer />
        </div>
      } />
      <Route path="/blogs" element={
        <div className="min-h-screen bg-white">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Blogs />
          </motion.div>
          <Footer />
        </div>
      } />
      <Route path="/blogs/:id" element={
        <div className="min-h-screen bg-white">
          <Header onNavigate={handleNavigate} currentPage={currentPage} />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <BlogDetail />
          </motion.div>
          <Footer />
        </div>
      } />
      <Route path="*" element={<NotFound />} />
    </Routes>
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
import { Link, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { SearchX } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();
  const handleNavigate = (page: string) => {
    if (page.startsWith('/')) {
      navigate(page);
    } else {
      navigate('/' + page);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onNavigate={handleNavigate} currentPage="404" />
      <main className="flex-grow flex items-center justify-center text-center px-4">
        <div>
          <div className="mb-8">
            <SearchX className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-gray-700 mb-4">صفحه یافت نشد</h2>
            <p className="text-lg text-gray-500 mb-8 max-w-md mx-auto">
              متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد. شاید آدرس را اشتباه وارد کرده‌اید یا صفحه حذف شده است.
            </p>
          </div>
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              بازگشت به صفحه اصلی
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
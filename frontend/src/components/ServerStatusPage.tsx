import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ServerStatusChart from './ServerStatusChart';

export default function ServerStatusPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'admin') {
      navigate('/admin');
      return;
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-teal-400 to-green-400 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div>
                <h1 className="text-lg">پنل مدیریت</h1>
                <p className="text-sm text-gray-600">
                  سامانه مدیریت بیمه البرز
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <button
                className="px-3 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                onClick={() => navigate('/admin')}
              >
                بازگشت به داشبورد
              </button>

              <button
                className="px-3 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
              >
                خروج
              </button>
            </div>

            <div className="md:hidden">
              <button
                className="px-3 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                onClick={() => { localStorage.removeItem('token'); window.location.href = '/'; }}
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">وضعیت سرور</h2>
          <p className="text-gray-600">مانیتورینگ لحظه‌ای عملکرد سرور و زمان پاسخ</p>
        </div>

        <div className="max-w-6xl mx-auto">
          <ServerStatusChart />
        </div>
      </div>
    </div>
  );
}
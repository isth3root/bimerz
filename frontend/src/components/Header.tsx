import { useState } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, User } from "lucide-react";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top bar */}
      <div className="bg-gray-50 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center flex-row-reverse">
          <div className="text-sm text-gray-700 font-bold">
            نمایندگی رئیس زاده
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('login')}
            className="text-green-600 hover:text-green-700 cursor-pointer"
          >
            <User className="h-4 w-4 mr-2" />
            ورود به سامانه
          </Button>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between flex-row-reverse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 rounded-lg flex items-center justify-center">
              <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">بیمه البرز</h1>
              <p className="text-sm text-gray-600">همراه شما در همه مراحل زندگی</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => onNavigate('/')}
              className={`cursor-pointer transition-colors ${currentPage === 'home' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => onNavigate('services')}
              className={`cursor-pointer transition-colors ${currentPage === 'services' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              خدمات
            </button>
            <button
              onClick={() => onNavigate('blogs')}
              className={`cursor-pointer transition-colors ${currentPage === 'blogs' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              وبلاگ
            </button>
            <button
              onClick={() => onNavigate('about')}
              className={`cursor-pointer transition-colors ${currentPage === 'about' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              درباره ما
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className={`cursor-pointer transition-colors ${currentPage === 'contact' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
            >
              تماس با ما
            </button>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-4 mt-8">
                <button
                  onClick={() => { onNavigate('/'); setIsOpen(false); }}
                  className={`text-right transition-colors ${currentPage === 'home' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
                >
                  صفحه اصلی
                </button>
                <button
                  onClick={() => { onNavigate('services'); setIsOpen(false); }}
                  className={`text-right transition-colors ${currentPage === 'services' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
                >
                  خدمات
                </button>
                <button
                  onClick={() => { onNavigate('blogs'); setIsOpen(false); }}
                  className={`text-right transition-colors ${currentPage === 'blogs' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
                >
                  وبلاگ
                </button>
                <button
                  onClick={() => { onNavigate('about'); setIsOpen(false); }}
                  className={`text-right transition-colors ${currentPage === 'about' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
                >
                  درباره ما
                </button>
                <button
                  onClick={() => { onNavigate('contact'); setIsOpen(false); }}
                  className={`text-right transition-colors ${currentPage === 'contact' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
                >
                  تماس با ما
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
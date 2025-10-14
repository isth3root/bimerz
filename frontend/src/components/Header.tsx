import { useState, memo } from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu, User, Gem } from "lucide-react";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Header = ({ onNavigate, currentPage }: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-to-br from-teal-400 to-green-400 py-2">
        <div className="container mx-auto px-4 flex justify-between items-center flex-row-reverse">
          <div className="text-sm text-black font-bold">
            نمایندگی رئیس زاده
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('/login')}
            className="text-black cursor-pointer font-bold"
          >
            <User className="h-4 w-4 mr-2 font-bold text-black" />
            حساب کاربری
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
              aria-current={currentPage === 'home' ? 'page' : undefined}
            >
              صفحه اصلی
            </button>
            <button
              onClick={() => onNavigate('/yaqut-alborz')}
              className={`group cursor-pointer transition-colors ${currentPage === 'yaqut-alborz' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
              aria-current={currentPage === 'yaqut-alborz' ? 'page' : undefined}
            >
              <Gem className="h-4 w-4 mr-2 inline group-hover:brightness-150 group-hover:drop-shadow-xl group-hover:scale-125 transition-all duration-300 mx-1" />
              یاقوت البرز
            </button>

            <button
              onClick={() => onNavigate('/blogs')}
              className={`cursor-pointer transition-colors ${currentPage === 'blogs' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
              aria-current={currentPage === 'blogs' ? 'page' : undefined}
            >
              اخبار
            </button>
            <button
              onClick={() => onNavigate('rules')}
              className={`cursor-pointer transition-colors ${currentPage === 'rules' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
              aria-current={currentPage === 'rules' ? 'page' : undefined}
            >
              قوانین بیمه
            </button>
            <button
              onClick={() => onNavigate('/about')}
              className={`cursor-pointer transition-colors ${currentPage === 'about' ? 'text-green-600 font-semibold' : 'text-gray-700 hover:text-green-600'}`}
              aria-current={currentPage === 'about' ? 'page' : undefined}
            >
              درباره ما
            </button>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button className="md:hidden" variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col gap-6 mt-8 px-4">
                <button
                  onClick={() => { onNavigate('/'); setIsOpen(false); }}
                  className={`w-full text-center py-3 px-4 rounded-lg transition-colors ${currentPage === 'home' ? 'bg-gradient-to-br from-teal-400 to-green-400 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  صفحه اصلی
                </button>
                <button
                  onClick={() => { onNavigate('/yaqut-alborz'); setIsOpen(false); }}
                  className={`group w-full text-center py-3 px-4 rounded-lg transition-colors ${currentPage === 'yaqut-alborz' ? 'bg-gradient-to-br from-teal-400 to-green-400 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  <Gem className="h-4 w-4 mr-2 inline group-hover:brightness-150 group-hover:drop-shadow-xl group-hover:scale-125 transition-all duration-300" />
                  یاقوت البرز
                </button>
                <button
                  onClick={() => { onNavigate('/blogs'); setIsOpen(false); }}
                  className={`w-full text-center py-3 px-4 rounded-lg transition-colors ${currentPage === 'blogs' ? 'bg-gradient-to-br from-teal-400 to-green-400 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  اخبار
                </button>
                <button
                  onClick={() => { onNavigate('rules'); setIsOpen(false); }}
                  className={`w-full text-center py-3 px-4 rounded-lg transition-colors ${currentPage === 'rules' ? 'bg-gradient-to-br from-teal-400 to-green-400 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  قوانین بیمه
                </button>
                <button
                  onClick={() => { onNavigate('/about'); setIsOpen(false); }}
                  className={`w-full text-center py-3 px-4 rounded-lg transition-colors ${currentPage === 'about' ? 'bg-gradient-to-br from-teal-400 to-green-400 font-semibold' : 'text-gray-700 hover:bg-gray-100'}`}
                >
                  درباره ما
                </button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default memo(Header);
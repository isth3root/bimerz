import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

const rules = [
  {
    title: 'اعتبار بیمه‌نامه',
    description: 'بیمه‌نامه فقط در بازه زمانی درج‌شده روی آن معتبر است. هر حادثه‌ای که قبل از شروع یا بعد از پایان تاریخ بیمه‌نامه رخ دهد، تحت پوشش قرار نمی‌گیرد.',
  },
  {
    title: 'صحت اطلاعات',
    description: 'بیمه‌گذار موظف است اطلاعات مربوط به خود و مورد بیمه را دقیق و کامل ارائه کند. هرگونه کتمان یا اعلام نادرست می‌تواند موجب بی‌اعتباری بیمه‌نامه شود.',
  },
  {
    title: 'پرداخت حق‌بیمه',
    description: 'پرداخت حق‌بیمه طبق قرارداد الزامی است. عدم پرداخت به‌موقع، مسئولیت مستقیم بیمه‌گذار را در پی خواهد داشت.',
  },
  {
    title: 'تعهدات بیمه‌گذار در حادثه',
    description: 'بیمه‌گذار باید بلافاصله پس از وقوع حادثه موضوع را به پلیس و شرکت بیمه اطلاع دهد و مدارک لازم را ارائه کند. تأخیر در اعلام می‌تواند منجر به کاهش یا عدم پرداخت خسارت شود.',
  },
  {
    title: 'تغییر شرایط بیمه‌نامه',
    description: 'هرگونه تغییر (مانند تغییر مالک، تغییر کاربری خودرو یا ملک) باید سریعاً به نمایندگی اطلاع داده شود. عدم اعلام تغییرات، مسئولیت بیمه‌گذار را افزایش می‌دهد.',
  },
  {
    title: 'استثنائات بیمه‌ای',
    description: 'خسارات ناشی از جنگ، شورش، فعالیت غیرقانونی، مصرف مواد مخدر یا الکل و خسارات عمدی تحت پوشش بیمه قرار نمی‌گیرد.',
  },
  {
    title: 'ابطال بیمه‌نامه',
    description: 'در صورت ابطال بیمه‌نامه توسط بیمه‌گذار یا شرکت بیمه، حق‌بیمه مصرف‌نشده پس از کسر هزینه‌های مقرر به بیمه‌گذار بازگردانده می‌شود.',
  },
  {
    title: 'مسئولیت‌های قانونی بیمه‌گذار',
    description: 'در صورت وقوع حادثه، مسئولیت‌های قانونی یا کیفری بیمه‌گذار (مانند تخلفات رانندگی یا جرایم) همچنان برقرار است و بیمه جایگزین آن‌ها نمی‌شود.',
  },
  {
    title: 'مدارک شناسایی معتبر',
    description: 'ارائه مدارک شناسایی معتبر و سند مربوطه (خودرو یا ملک) هنگام دریافت خسارت یا درخواست تغییرات بیمه‌نامه الزامی است.',
  },
  {
    title: 'گزارش کارشناسی',
    description: 'در برخی خسارت‌ها، پرداخت غرامت منوط به بررسی و تأیید کارشناس رسمی بیمه است. بدون گزارش کارشناسی، امکان پرداخت خسارت وجود ندارد.',
  },
];

const RulesSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % rules.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + rules.length) % rules.length);
  };

  const getCardStyle = (position: number) => {
    switch (position) {
      case 0: // left
        return {
          transform: 'translateX(-70%) rotateY(15deg) scale(0.8)',
          zIndex: 1,
          opacity: 0.8,
        };
      case 1: // center
        return {
          transform: 'translateX(0) rotateY(0) scale(1)',
          zIndex: 4,
          opacity: 1,
        };
      case 2: // right
        return {
          transform: 'translateX(70%) rotateY(-15deg) scale(0.8)',
          zIndex: 1,
          opacity: 0.8,
        };
      case 3: // behind
        return {
          transform: 'translateX(0) translateZ(-50px) scale(0.6)',
          zIndex: 2,
          opacity: 0.6,
        };
      default:
        return {};
    }
  };

  return (
    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-800">قوانین بیمه</h2>
        <div className="relative">
          {/* Desktop arrows */}
          <Button
            onClick={prev}
            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white border-2 border-blue-200"
            size="icon"
          >
            <ChevronLeft className="h-6 w-6 text-blue-600" />
          </Button>
          <div className="relative flex items-center justify-center h-96 lg:h-[28rem] overflow-hidden" style={{ perspective: '1200px' }}>
            <div className="relative w-full max-w-6xl lg:max-w-7xl h-full flex items-center justify-center">
              {[0, 1, 2, 3].map((pos) => {
                const ruleIndex = (currentIndex + pos) % rules.length;
                const rule = rules[ruleIndex];
                return (
                  <Card
                    key={ruleIndex}
                    className="absolute w-72 h-56 sm:w-80 sm:h-64 md:w-96 md:h-72 lg:w-[28rem] lg:h-80 transition-all duration-700 ease-out shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50 hover:shadow-3xl"
                    style={getCardStyle(pos)}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-center text-black leading-tight">
                        {rule.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs sm:text-sm md:text-base text-gray-700 text-center leading-relaxed px-2">
                        {rule.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
          <Button
            onClick={next}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white border-2 border-blue-200"
            size="icon"
          >
            <ChevronRight className="h-6 w-6 text-blue-600" />
          </Button>
          {/* Mobile arrows below */}
          <div className="flex justify-center gap-4 mt-8 lg:hidden">
            <Button
              onClick={next}
              className="bg-green-600 hover:bg-blue-700 text-white shadow-lg"
              size="icon"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            <Button
              onClick={prev}
              className="bg-green-600 hover:bg-blue-700 text-white shadow-lg"
              size="icon"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RulesSection;
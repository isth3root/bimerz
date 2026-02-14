import { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HeroSliderProps {
  onNavigate: (page: string) => void;
}

export function HeroSlider({ onNavigate }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: "بیمه خودرو با بهترین پوشش",
      subtitle: "محافظت کامل از خودروی شما با قیمت مناسب",
      image: "https://images.unsplash.com/photo-1690533681839-01c4d82d7c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnN1cmFuY2UlMjBmYW1pbHl8ZW58MXx8fHwxNzU3NDEyNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      cta: "دریافت قیمت"
    },
    {
      id: 2,
      title: "بیمه آتش‌سوزی ساختمان",
      subtitle: "امنیت خانه و محل کار شما تضمین می‌باشد",
      image: "https://images.unsplash.com/photo-1690533681839-01c4d82d7c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnN1cmFuY2UlMjBmYW1pbHl8ZW58MXx8fHwxNzU3NDEyNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      cta: "اطلاعات بیشتر"
    },
    {
      id: 3,
      title: "بیمه مسئولیت مدنی",
      subtitle: "پوشش جامع در برابر خسارات احتمالی",
      image: "https://images.unsplash.com/photo-1690533681839-01c4d82d7c86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnN1cmFuY2UlMjBmYW1pbHl8ZW58MXx8fHwxNzU3NDEyNzYzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      cta: "مشاوره رایگان"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[500px] bg-gradient-to-r from-green-600 to-green-700 overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="absolute inset-0">
        <ImageWithFallback
          src={slides[currentSlide].image}
          alt={slides[currentSlide].title}
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl text-white">
          <h2 className="text-4xl md:text-5xl mb-4 leading-tight">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xl mb-8 text-green-50">
            {slides[currentSlide].subtitle}
          </p>
          <Button
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50"
            onClick={() => onNavigate('login')}
          >
            {slides[currentSlide].cta}
          </Button>
        </div>
      </div>


      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
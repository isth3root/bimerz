import { Button } from "./ui/button";
import { Download, Calculator, FileCheck, Heart, History, MapPin, CreditCard } from "lucide-react";

export default function YaqutAlborz() {

  const VideoEmbed = () => (
    <div className="relative w-full pt-[56.25%]"> {/* 16:9 ratio */}
      <iframe
        src="https://www.aparat.com/video/video/embed/videohash/sxuxh00/vt/frame?titleShow=true"
        title="ویدیو معرفی یاقوت البرز"
        allowFullScreen
        loading="lazy"
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  )
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 to-green-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">یاقوت البرز</h1>
          <p className="text-xl max-w-2xl mx-auto">
            سیستم پرداخت آنلاین خسارت بیمه البرز
          </p>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">امکانات اپلیکیشن</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-110 hover:rotate-2 hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 transition-all duration-500 cursor-pointer text-center group">
                <Calculator className="h-8 w-8 text-teal-600 mx-auto mb-4 group-hover:animate-bounce" />
                <p className="text-lg font-semibold group-hover:text-teal-700">ارزیابی آنلاین خسارت</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-110 hover:-rotate-2 hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 transition-all duration-500 cursor-pointer text-center group">
                <FileCheck className="h-8 w-8 text-teal-600 mx-auto mb-4 group-hover:animate-bounce" />
                <p className="text-lg font-semibold group-hover:text-teal-700">استعلام اصالت بیمه نامه</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-110 hover:rotate-2 hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 transition-all duration-500 cursor-pointer text-center group">
                <Heart className="h-8 w-8 text-teal-600 mx-auto mb-4 group-hover:animate-bounce" />
                <p className="text-lg font-semibold group-hover:text-teal-700">خدمات آنلاین پزشکی</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-110 hover:-rotate-2 hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 transition-all duration-500 cursor-pointer text-center group">
                <History className="h-8 w-8 text-teal-600 mx-auto mb-4 group-hover:animate-bounce" />
                <p className="text-lg font-semibold group-hover:text-teal-700">امکان رویت سوابق و خسارت‌ها</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-110 hover:rotate-2 hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 transition-all duration-500 cursor-pointer text-center group">
                <MapPin className="h-8 w-8 text-teal-600 mx-auto mb-4 group-hover:animate-bounce" />
                <p className="text-lg font-semibold group-hover:text-teal-700">امکان دسترسی به راهنمای شعب و نمایندگی‌ها</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl hover:scale-110 hover:-rotate-2 hover:bg-gradient-to-br hover:from-teal-50 hover:to-green-50 transition-all duration-500 cursor-pointer text-center group">
                <CreditCard className="h-8 w-8 text-teal-600 mx-auto mb-4 group-hover:animate-bounce" />
                <p className="text-lg font-semibold group-hover:text-teal-700">پرداخت آنلاین حق بیمه</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">ویدیو معرفی</h2>
            <VideoEmbed />
          </div>
        </div>
      </section>

      {/* Damage Registration Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">نحوه ثبت آنلاین خسارت بدنه خودرو</h2>
            <p className="text-lg text-gray-700 mb-6">
              در یاقوت البرز، سامانه‌ای ویژه برای «ثبت خسارت بدنه خودرو» ایجاد شده است که به کاربران اجازه می‌دهد تمامی مراحل اعلام خسارت را از طریق این سامانه و آن هم در کمتر از ۱۵ دقیقه و بدون نیاز به مراجعه حضوری به مراکز پرداخت خسارت بیمه البرز انجام دهند.
            </p>
            <p className="text-lg text-gray-700 mb-6">
              مراحل ثبت خسارت شامل وارد کردن اطلاعاتی نظیر موقعیت محل حادثه، تاریخ، ساعت، شهر و نوع حادثه است. پر کردن اطلاعات ستاره‌دار راننده (شامل کد ملی، تاریخ صدور و شماره گواهینامه) الزامی می‌باشد. متقاضی باید تصویر پشت و روی گواهینامه، پشت و روی کارت خودرو و کارت ملی مالک، و همچنین عکس‌هایی از شماره شاسی و زوایای آسیب‌دیده خودرو را بارگذاری کند.
            </p>
            <p className="text-lg text-gray-700">
              پس از ثبت نهایی، کارشناسان بیمه البرز در کوتاه‌ترین زمان درخواست را به صورت برخط بررسی کرده و نتیجه را پیامک می‌کنند. مبلغ خسارت نیز در کمتر از ۴۸ ساعت به حساب فرد واریز خواهد شد.
            </p>
          </div>
        </div>
      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">دانلود اپلیکیشن <span className="hover:text-green-600 hover:font-bold cursor-pointer transition-colors duration-300">یاقوت البرز</span></h2>
            <div className="flex justify-center gap-4 mb-8">
              <Button onClick={() => window.open('https://cafebazaar.ir/app/com.Radisan.Alborz.SuperApp', '_blank')}>
                <Download className="h-4 w-4 ml-2" />
                دانلود از بازار
              </Button>
              <Button onClick={() => window.open('https://myket.ir/app/com.Radisan.Alborz.SuperApp', '_blank')}>
                <Download className="h-4 w-4 ml-2" />
                دانلود از مایکت
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className=" bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-lg text-gray-700">
                ورود به این برنامه پس از ثبت نام اولیه با استفاده از اطلاعات شخصی مانند کد ملی، شماره موبایل، تاریخ تولد، نام و نام خانوادگی انجام می‌شود
            </p>
          </div>
        </div>
      </section>
      </section>
    </div>
  );
}
import { Separator } from "./ui/separator";
import { Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div>
                <h3 className="text-xl">بیمه البرز</h3>
                <p className="text-sm text-gray-400">همراه شما در همه مراحل زندگی</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              بیش از ۲۰ سال تجربه در ارائه خدمات بیمه‌ای با بالاترین کیفیت و اعتماد مشتریان
            </p>
          </div>


          {/* Contact info */}
          <div>
            <h4 className="text-lg mb-6">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-400">09385540717</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-green-400 mt-1" />
                <span className="text-gray-400">اهواز امانیه خیابان سقراط شرقی مجتمع گلاریس طبقه ۳ واحد ۱۱</span>
              </li>
            </ul>
          </div>

          {/* Map */}
          <div className="flex flex-col">
            <p>موقعیت ما روی نقشه</p>
            <div className="mt-4">
              <iframe
                src="https://maps.google.com/maps?q=31.3204177,48.6673714&output=embed"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-gray-800" />

      {/* Copyright */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center text-sm text-gray-400">
          <p>© ۱۴۰۴ بیمه البرز. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}
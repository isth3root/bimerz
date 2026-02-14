import { memo } from "react";
import { Separator } from "./ui/separator";
import { Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-teal-400 to-green-400">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">بیمه البرز</h3>
                <p className="text-sm font-semibold">همراه شما در همه مراحل زندگی</p>
              </div>
            </div>
            <p className="font-semibold leading-relaxed mb-6 mt-12">
               تجربه، تخصص و اعتماد؛<br></br> سه رکن خدمات ما در بیمه البرز
            </p>
          </div>
          
          <div>
            <h4 className="text-lg mb-6 font-semibold">تماس با ما</h4>
            <ul className="space-y-4">

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <a href="tel:09385540717" className="font-semibold">09385540717</a>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <a href="tel:061-33303066" className="font-semibold">061-33303066</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-1" />
                <span className="font-semibold">اهواز، امانیه خیابان سقراط شرقی<br />مجتمع گلاریس طبقه ۳ واحد ۱۱</span>
              </li>
            </ul>
          </div>


          <div className="flex flex-col">
            <p className="font-semibold">موقعیت ما روی نقشه</p>
            <div className="mt-4">
              <iframe
                src="https://maps.google.com/maps?q=31.3204177,48.6673714&output=embed"
                width="100%"
                height="150"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-3xl"
                title="موقعیت بیمه البرز روی نقشه گوگل"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-teal-500" />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-center items-center text-sm">
          <p className="font-semibold text-xs">تمامی حقوق سایت متعلق به نمایندگی رئیس زاده می باشد</p>
        </div>
      </div>
          <p className="font-semibold text-center text-md">ساخته شده توسط <a href="https://isth3root.github.io/portfolio/" target="_blank" className="text-xl text-red-500 hover:underline" rel="noopener noreferrer">محمدامین</a></p>
    </footer>
  );
};

export default memo(Footer);
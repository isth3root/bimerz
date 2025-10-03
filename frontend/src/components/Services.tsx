import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Car, Shield, Flame, Users, Home, Briefcase, CheckCircle, ArrowRight } from "lucide-react";

export function Services() {
  const services = [
    {
      id: 1,
      title: "بیمه شخص ثالث",
      description: "پوشش کامل خسارات وارده به اشخاص ثالث طبق قانون",
      icon: Car,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      features: [
        "پوشش خسارات جانی تا سقف قانونی",
        "پوشش خسارات مالی تا سقف قانونی",
        "پوشش خسارات وارد شده به اموال عمومی",
        "پرداخت سریع غرامت",
        "مشاوره رایگان برای تعیین پوشش مناسب"
      ],
      details: `
        بیمه شخص ثالث یکی از انواع بیمه‌های اجباری در ایران است که طبق قانون،
        تمامی دارندگان خودرو ملزم به خرید آن هستند. این بیمه خسارات جانی و مالی
        وارد شده به اشخاص ثالث (راننده و سرنشینان سایر خودروها) را پوشش می‌دهد.

        پوشش‌های اصلی:
        • خسارت جانی: تا سقف ۳۶۰ میلیون تومان برای هر نفر
        • خسارت مالی: تا سقف ۱۸۰ میلیون تومان برای هر خودرو
        • خسارت اموال عمومی: تا سقف ۵۰ میلیون تومان

        مزایای بیمه البرز:
        • پرداخت سریع غرامت (کمترین زمان بررسی پرونده)
        • پوشش اضافی برای حوادث رانندگی
        • مشاوره تخصصی برای انتخاب پوشش مناسب
        • پشتیبانی ۲۴ ساعته
      `,
      price: "از ۲۵۰,۰۰۰ تومان"
    },
    {
      id: 2,
      title: "بیمه بدنه خودرو",
      description: "محافظت از خودروی شما در برابر تصادف، سرقت و خسارات",
      icon: Shield,
      color: "text-green-600",
      bgColor: "bg-green-50",
      features: [
        "پوشش کامل تصادفات",
        "بیمه سرقت کلی و جزئی",
        "خسارات طبیعی (سیل، زلزله، آتشفشان)",
        "پوشش شکست شیشه",
        "پوشش لوازم اضافی"
      ],
      details: `
        بیمه بدنه خودرو پوشش کاملی برای محافظت از خودروی شما در برابر
        انواع خسارات و حوادث فراهم می‌کند. این بیمه اختیاری است اما
        برای حفظ سرمایه‌گذاری شما در خودرو بسیار ضروری است.

        پوشش‌های اصلی:
        • تصادفات رانندگی
        • سرقت کلی خودرو
        • سرقت قطعات خودرو
        • خسارات طبیعی
        • آتش‌سوزی و انفجار
        • شکست شیشه‌های خودرو

        مزایای بیمه البرز:
        • پوشش بدون فرانشیز برای برخی خسارات
        • تعمیر در تعمیرگاه‌های معتبر
        • ارزیابی دقیق خسارت توسط کارشناسان مجرب
        • پرداخت سریع خسارت
      `,
      price: "از ۵۰۰,۰۰۰ تومان"
    },
    {
      id: 3,
      title: "بیمه آتش‌سوزی",
      description: "حفاظت از اموال در برابر آتش‌سوزی و حوادث طبیعی",
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-50",
      features: [
        "آتش‌سوزی و انفجار",
        "خسارات طبیعی (زلزله، سیل، طوفان)",
        "سرقت با شکست حرز",
        "پوشش اموال منقول",
        "پوشش مسئولیت مدنی"
      ],
      details: `
        بیمه آتش‌سوزی پوشش کاملی برای محافظت از ساختمان و اموال شما
        در برابر آتش‌سوزی و سایر حوادث طبیعی و غیرطبیعی فراهم می‌کند.
        این بیمه برای تمامی ساختمان‌های مسکونی و تجاری ضروری است.

        پوشش‌های اصلی:
        • آتش‌سوزی و انفجار
        • صاعقه
        • زلزله و آتشفشان
        • سیل و طوفان
        • سرقت با شکست حرز
        • شکست شیشه‌های ساختمان

        مزایای بیمه البرز:
        • پوشش برای ساختمان و محتویات
        • ارزیابی ریسک توسط کارشناسان متخصص
        • پرداخت خسارت بر اساس ارزش واقعی
        • پوشش اضافی برای نوسانات بازار
      `,
      price: "از ۳۰۰,۰۰۰ تومان"
    },
    {
      id: 4,
      title: "بیمه مسئولیت مدنی",
      description: "پوشش مسئولیت‌های حقوقی و مالی شما",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      features: [
        "مسئولیت شخصی",
        "مسئولیت حرفه‌ای",
        "مسئولیت کارفرما",
        "پوشش حقوقی",
        "پوشش مالی"
      ],
      details: `
        بیمه مسئولیت مدنی پوشش کاملی برای مسئولیت‌های قانونی شما
        در برابر اشخاص ثالث فراهم می‌کند. این بیمه برای افرادی که
        فعالیت‌های حرفه‌ای دارند ضروری است.

        انواع پوشش:
        • مسئولیت حرفه‌ای (پزشکان، مهندسان، وکلا)
        • مسئولیت کارفرما در قبال کارکنان
        • مسئولیت مدیران شرکت‌ها
        • مسئولیت صاحبان خودرو
        • مسئولیت صاحبان اماکن

        مزایای بیمه البرز:
        • پوشش تا سقف‌های بالا
        • حمایت حقوقی در صورت دعاوی
        • پرداخت سریع خسارت
        • مشاوره تخصصی
      `,
      price: "از ۴۰۰,۰۰۰ تومان"
    },
    {
      id: 5,
      title: "بیمه منزل",
      description: "حفاظت کامل از خانه و وسایل شخصی",
      icon: Home,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      features: [
        "پوشش ساختمان",
        "اموال منقول",
        "مسئولیت مدنی",
        "پوشش الکترونیکی",
        "سرقت و ربایش"
      ],
      details: `
        بیمه منزل پوشش کاملی برای محافظت از خانه و تمامی دارایی‌های
        شما فراهم می‌کند. این بیمه شامل ساختمان، мебلات، وسایل برقی
        و سایر اموال منقول می‌شود.

        پوشش‌های اصلی:
        • ساختمان مسکونی
        • мебلات و وسایل منزل
        • وسایل برقی و الکترونیکی
        • زیورآلات و اشیای قیمتی
        • مسئولیت در قبال همسایگان
        • سرقت و ربایش

        مزایای بیمه البرز:
        • پوشش برای نوسانات ارزش اموال
        • ارزیابی دقیق توسط کارشناسان
        • پرداخت خسارت بر اساس ارزش روز
        • پوشش اضافی برای حوادث طبیعی
      `,
      price: "از ۶۰۰,۰۰۰ تومان"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">خدمات بیمه‌ای ما</h1>
          <p className="text-xl max-w-3xl mx-auto">
            طیف کاملی از خدمات بیمه‌ای با بهترین کیفیت و پوشش‌های جامع
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <Card key={service.id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <CardHeader className={`${service.bgColor} pb-6`}>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-16 h-16 ${service.bgColor} rounded-full flex items-center justify-center`}>
                        <IconComponent className={`h-8 w-8 ${service.color}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {service.price}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{service.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3 mb-6">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 ml-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <details className="mb-4">
                      <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-green-600 flex items-center">
                        <ArrowRight className="h-4 w-4 ml-2" />
                        جزئیات بیشتر
                      </summary>
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {service.details}
                        </p>
                      </div>
                    </details>

                    <Button className="w-full" variant="outline">
                      درخواست بیمه
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">نیاز به مشاوره دارید؟</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            کارشناسان ما آماده پاسخگویی به سوالات شما و راهنمایی در انتخاب بهترین پوشش بیمه‌ای هستند
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:+989385540717">
              <Button size="lg" className="px-8 cursor-pointer">
                تماس با ما
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
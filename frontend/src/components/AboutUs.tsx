import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Users, Award, Shield, Heart, Target, TrendingUp } from "lucide-react";

export function AboutUs() {
  const stats = [
    { number: "۲۰+", label: "سال تجربه", icon: Award },
    { number: "۱۰۰۰+", label: "مشتری راضی", icon: Users },
    { number: "۱۰۰+", label: "شریک تجاری", icon: Shield },
    { number: "۹۹%", label: "رضایت مشتری", icon: Heart }
  ];

  const values = [
    {
      title: "صداقت و شفافیت",
      description: "در تمامی تعاملات خود با مشتریان و شرکا، صداقت و شفافیت را رعایت می‌کنیم",
      icon: Shield
    },
    {
      title: "کیفیت بالا",
      description: "بهترین خدمات بیمه‌ای را با بالاترین کیفیت ارائه می‌دهیم",
      icon: Award
    },
    {
      title: "مشتری مداری",
      description: "نیازها و رضایت مشتریان در اولویت کاری ما قرار دارد",
      icon: Heart
    },
    {
      title: "نوآوری",
      description: "همواره به دنبال راهکارهای نوین برای بهبود خدمات هستیم",
      icon: Target
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 to-green-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">درباره بیمه البرز</h1>
          <p className="text-xl max-w-3xl mx-auto">
            بیش از دو دهه تجربه در ارائه خدمات بیمه‌ای با کیفیت و اعتمادسازی در جامعه
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">داستان ما</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  بیمه البرز با بیش از ۲۰ سال تجربه در صنعت بیمه، یکی از معتبرترین شرکت‌های بیمه‌ای کشور است.
                  ما با تکیه بر دانش فنی متخصصین خود و استفاده از فناوری‌های روز، خدمات متنوعی در زمینه بیمه ارائه می‌دهیم.
                </p>
                <p>
                  هدف ما ایجاد آرامش خاطر برای مشتریان از طریق ارائه پوشش‌های بیمه‌ای جامع و قابل اعتماد است.
                  تیم ما متشکل از کارشناسان مجرب و حرفه‌ای است که همواره در تلاش برای بهبود کیفیت خدمات هستند.
                </p>
                <p>
                  ما باور داریم که بیمه نه تنها یک ضرورت قانونی، بلکه ابزاری برای مدیریت ریسک و تامین آینده است.
                  بنابراین، با ارائه مشاوره‌های تخصصی، مشتریان را در انتخاب بهترین پوشش‌های بیمه‌ای یاری می‌رسانیم.
                </p>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-center">چرا بیمه البرز؟</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>پرداخت سریع و بدون دردسر غرامت</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>مشاوره رایگان توسط کارشناسان مجرب</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>پوشش‌های بیمه‌ای متنوع و جامع</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>پشتیبانی ۲۴ ساعته</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>استفاده از فناوری‌های نوین</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">ارزش‌های ما</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ارزش‌هایی که در تمامی فعالیت‌های ما راهنمای ما هستند
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-green-600" />
                  مأموریت ما
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  ارائه خدمات بیمه‌ای با کیفیت بالا و ایجاد اطمینان خاطر برای مشتریان
                  از طریق پوشش‌های جامع، پرداخت سریع غرامت و پشتیبانی مستمر.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                  چشم‌انداز ما
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  تبدیل شدن به بهترین شرکت بیمه‌ای کشور از طریق نوآوری، کیفیت خدمات
                  و رضایت حداکثری مشتریان در تمامی زمینه‌های بیمه‌ای.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
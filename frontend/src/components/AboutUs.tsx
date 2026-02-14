import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Award, Shield, Heart, Target, TrendingUp, CheckCircle } from "lucide-react";

export default function AboutUs() {
  

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

  const achievements = [
    "دارا بودن بیشترین سرمایه در بین شرکت های بیمه خصوصی",
    "شفاف ترین شرکت بیمه بورسی بر اساس اعلام سازمان بورس اوراق بهادار تهران",
    "دریافت تندیس نقره ای رعایت حقوق مصرف کنندگان طی دو سال متوالی ۱۳۹۴ و ۱۳۹۵",
    "دریافت گواهینامه رعایت حقوق مصرف کننده طی سه سال ۸۸ و ۹۱ و ۹۳",
    "کسب رتبه اول مشتری مداری طی ۹ سال متوالی",
    "کسب رتبه اول انفورماتیک در بین شرکت های بیمه کشور طی دو سال متوالی ۱۳۹۴ و ۱۳۹۵",
    "کسب عنوان برترین بیمه کشور بر اساس رتبه بندی بیمه مرکزی جمهوری اسلامی ایران",
    "کسب جایگاه نخست موثرترین درصد رشد در صنعت بیمه",
    "ارائه دهنده محصولات نوین بیمه ای همچون شوکا، شلر ، بلوط و بیمه های زندگی پروژه محور و بریس",
    "مجری صدور بیمه نامه بین المللی Frontier",
    "راهبر صنعت بیمه در تاسیس دو شرکت بیمه ای خارجی",
    "پای ثابت فهرست یکصد شرکت برتر کشور",
    "کسب مقام اول شفافیت گزارشگری مالی در بین شرکت های بیمه در ارزیابی بیمه مرکزی جمهوری اسلامی ایران",
    "کسب مقام اول حضور و کارایی در بازار سرمایه در بین شرکت های بیمه در ارزیابی بیمه مرکزی جمهوری اسلامی ایران",
    "کسب مقام اول کاربرد فناوری اطلاعات (IT) در بین شرکت های بیمه در ارزیابی بیمه مرکزی جمهوری اسلامی ایران",
    "کسب مقام اول کارایی عملیاتی در بین شرکت های بیمه در ارزیابی بیمه مرکزی جمهوری اسلامی ایران",
    "موثرترین درصد رشد در صنعت بیمه",
    "سودآورترین شرکت بیمه‌ای در سال 1402",
    "کسب عنوان برترین شرکت بیمه خصوصی از سوی سازمان مدیریت صنعتی",
    "تنها شرکت بیمه ای حامی محیط زیست با دریافت تندیس برند سبز"
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-teal-400 to-green-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">درباره بیمه البرز</h1>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">تاریخچه شرکت</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              شرکت بیمه البرز با هدف ارائه خدمات بیمه ای مطلوب و با کیفیت به هموطنان و ایجاد تنوع در بازار بیمه و کسب رضایت بیمه گذراران در تاریخ ۲۸ تیرماه ۱۳۳۸ توسط بخش خصوصی تاسیس و در مدت زمان کوتاهی توانست اعتماد بسیاری از صاحبان سرمایه و کالا را به خود جلب نماید. پس از پیروزی انقلاب اسلامی بیمه البرز به دلیل عملکرد موفق با همان نام به فعالیت خود ادامه داد . شرکت بیمه البرز هم اکنون با بیش از 60 شعبه و بیش از 4000 نماینده و کارگزار فعال، در سرتاسر کشور آماده ارایه خدمات بیمه ای به هموطنان است .
            </p>
            <p className="text-gray-600 mb-8 leading-relaxed">
              بیمه البرز که دارای بیشترین ظرفیت نگهداری ریسک در بین شرکت های بیمه خصوصی است،‌ در سال‌های اخیر موفقیت‌های بیشماری در صنعت بیمه کشور و همچنین دستگاه‌های اجرایی کشور به دست آورده است.
            </p>
            <h3 className="text-2xl font-bold mb-6">دستاوردهای سال های اخیر بیمه البرز</h3>
            <ul className="space-y-4">
              {achievements.map((achievement, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{achievement}</span>
                </li>
              ))}
            </ul>
            <p className="text-gray-600 mt-8 leading-relaxed">
              سرمایه ، ذخایر و اندوخته کافی ، بدنه کارشناسی متخصص و حرفه ای ، سرعت در ارزیابی و پرداخت خسارت از شاخص های توانگری و وجود مشتریان وفادار و قدیمی ، ارتباطات گسترده با بازار جهانی بیمه، مدیریت علمی و پاسخگو و نسبت‌های مالی بسیار خوب از شاخص های ماندگاری این شرکت به حساب می آید . بیمه البرز در سال ۱۳۸۸ به عنوان اولین شرکت بیمه دولتی در بورس پذیرفته شد و سهام آن با استقبال بی نظیر سرمایه گذاران و فعالان بورس همراه شد و ۸۰ درصد سهام آن واگذار شد و بدین ترتیب از یک شرکت بیمه دولتی به شرکت بیمه خصوصی تغییر مالکیت داد .
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow bg-gradient-to-br from-teal-400 to-green-400">
                  <CardHeader>
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm text-black">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

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
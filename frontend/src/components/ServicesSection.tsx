import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Car, Shield, Flame, Users, Home, Briefcase } from "lucide-react";

interface ServicesSectionProps {
  onNavigate: (page: string) => void;
}

export function ServicesSection({ onNavigate }: ServicesSectionProps) {
  const services = [
    {
      id: 1,
      title: "بیمه شخص ثالث",
      description: "پوشش کامل خسارات وارده به اشخاص ثالث طبق قانون",
      icon: Car,
      features: ["پوشش خسارات جانی", "پوشش خسارات مالی", "پرداخت سریع غرامت"],
      color: "text-blue-600"
    },
    {
      id: 2,
      title: "بیمه بدنه خودرو",
      description: "محافظت از خودروی شما در برابر تصادف، سرقت و خسارات",
      icon: Shield,
      features: ["پوشش تصادف", "بیمه سرقت", "خسارات طبیعی"],
      color: "text-green-600"
    },
    {
      id: 3,
      title: "بیمه آتش‌سوزی",
      description: "حفاظت از اموال در برابر آتش‌سوزی و حوادث طبیعی",
      icon: Flame,
      features: ["آتش‌سوزی ساختمان", "خسارات طبیعی", "اموال منقول"],
      color: "text-red-600"
    },
    {
      id: 4,
      title: "بیمه مسئولیت مدنی",
      description: "پوشش مسئولیت‌های حقوقی و مالی شما",
      icon: Users,
      features: ["مسئولیت شخصی", "مسئولیت حرفه‌ای", "پوشش حقوقی"],
      color: "text-purple-600"
    },
    {
      id: 5,
      title: "بیمه منزل",
      description: "حفاظت کامل از خانه و وسایل شخصی",
      icon: Home,
      features: ["ساختمان", "اموال منقول", "مسئولیت مدنی"],
      color: "text-orange-600"
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">خدمات بیمه‌ای ما</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            با بیش از ۲۰ سال تجربه، طیف کاملی از خدمات بیمه‌ای را با بهترین کیفیت ارائه می‌دهیم
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <IconComponent className={`h-8 w-8 ${service.color}`} />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mx-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" variant="outline" onClick={() => onNavigate('services')}>
                    اطلاعات بیشتر
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Phone, MapPin } from "lucide-react";

export function ContactUs() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-teal-400 to-green-400 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">تماس با ما</h1>
          <p className="text-xl max-w-2xl mx-auto">
            در هر زمان از روز آماده پاسخگویی به سوالات و نیازهای شما هستیم
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">اطلاعات تماس</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">تلفن</h3>
                    <p className="text-gray-600">09385540717</p>
                    <p className="text-gray-600">061-33303066</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">آدرس</h3>
                    <p className="text-gray-600">
                      اهواز امانیه خیابان سقراط شرقی مجتمع گلاریس طبقه ۳ واحد ۱۱
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>فرم تماس</CardTitle>
                  <CardDescription>
                    پیام خود را برای ما ارسال کنید، در اولین فرصت پاسخ خواهیم داد
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="mb-2 block">نام و نام خانوادگی</Label>
                    <Input id="name" placeholder="نام و نام خانوادگی خود را وارد کنید" />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="mb-2 block">شماره تماس</Label>
                    <Input id="phone" placeholder="شماره تماس خود را وارد کنید" />
                  </div>

                  <div>
                    <Label htmlFor="message" className="mb-2 block">پیام</Label>
                    <Textarea
                      id="message"
                      placeholder="پیام خود را بنویسید..."
                      rows={5}
                    />
                  </div>

                  <Button className="w-full">ارسال پیام</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">موقعیت ما روی نقشه</h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <iframe
              src="https://maps.google.com/maps?q=31.3204177,48.6673714&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
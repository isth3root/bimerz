import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Button } from "./ui/button";

export function FAQSection() {
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      id: "faq-1",
      question: "چطور می‌توانم اقساط بیمه‌نامه‌ام را پرداخت کنم؟",
      answer: "پرداخت اقساط از طریق همین سایت و با مراجعه به حساب کاربری شما امکان‌پذیر است."
    },
    {
      id: "faq-2",
      question: "اگر قسط عقب بیفتد، چه اتفاقی می‌افتد؟",
      answer: "در صورت تأخیر در پرداخت قسط، ممکن است برخی بیمه‌نامه‌ها ابطال شوند یا در زمان دریافت خسارت با مشکل مواجه شوید و خسارت به‌طور کامل پرداخت نشود. توصیه می‌شود اقساط را همواره پیش از سررسید پرداخت نمایید"
    },
    {
      id: "faq-3",
      question: "چقدر طول می‌کشد خسارت پرداخت شود؟",
      answer: "زمان پرداخت خسارت بسته به نوع بیمه‌نامه و بررسی مدارک دارد؛ معمولاً در اسرع وقت پس از تکمیل مدارک و تأیید شرکت انجام می‌شود."
    },
    {
      id: "faq-4",
      question: "بیمه شامل چه مواردی نمی‌شود؟",
      answer: "خسارت‌های ناشی از عمد، حوادث غیرمجاز، مصرف مواد مخدر یا مشروبات الکلی و سایر شرایط مندرج در قرارداد تحت پوشش بیمه نیستند"
    },
    {
      id: "faq-5",
      question: "آیا برای صدور بیمه بدنه کارشناسی خودرو لازم است؟",
      answer: "بله، قبل از صدور بیمه بدنه، خودرو توسط کارشناس بازدید و عکس‌برداری می‌شود"
    },
    {
      id: "faq-6",
      question: "آیا امکان تمدید بیمه‌نامه به صورت غیرحضوری وجود دارد؟",
      answer: "بله، می‌توانید از طریق تماس با دفتر یا ارسال مدارک به واتساپ، بیمه‌نامه را تمدید کنید"
    },
    {
      id: "faq-7",
      question: "چطور می‌توانم از تخفیف‌های بیمه‌ای استفاده کنم؟",
      answer: "تخفیف‌ها شامل عدم خسارت، بیمه‌نامه‌های گروهی، یا تمدید به موقع بیمه‌نامه است"
    },
    {
      id: "faq-8",
      question: "اگر قسط بیمه‌نامه را دیرتر از موعد پرداخت کنم، بیمه من باطل می‌شود؟",
      answer: "بستگی به نوع بیمه‌نامه دارد؛ بهتر است اقساط را قبل از سررسید پرداخت کنید تا هنگام دریافت خسارت با مشکل مواجه نشوید."
    },
    {
      id: "faq-9",
      question: "چطور می‌تونم بیمه‌نامه‌ام رو اقساطی پرداخت کنم؟",
      answer: "بعضی از بیمه‌نامه‌ها امکان پرداخت اقساطی دارن؛ شرایطش رو باید هنگام صدور با نمایندگی هماهنگ کنید"
    },
    {
      id: "faq-10",
      question: "اگر موقع حادثه راننده کسی غیر از مالک خودرو باشه، بیمه خسارت رو پرداخت می‌کنه؟",
      answer: "بله، در بیمه شخص ثالث راننده مقصر مهم نیست، خسارت پرداخت می‌شه"
    },
    {
      id: "faq-11",
      question: "آیا بیمه آتش‌سوزی فقط مخصوص خانه است؟",
      answer: "نه، بیمه آتش‌سوزی می‌تونه برای مغازه، دفتر کار یا انبار هم صادر بشه"
    }
  ];

  const displayedFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-4">سوالات متداول</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            پاسخ سوالات رایج در مورد خدمات بیمه‌ای
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {displayedFaqs.map((faq) => (
              <AccordionItem
                key={faq.id}
                value={faq.id}
                className="bg-white rounded-lg border-0 shadow-sm"
              >
                <AccordionTrigger className="px-6 py-4 text-right hover:no-underline hover:bg-gray-50 rounded-lg">
                  <span className="text-right pr-4">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          <div className="text-center mt-8">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="px-6 py-2"
            >
              {showAll ? "نمایش کمتر" : "نمایش بیشتر"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
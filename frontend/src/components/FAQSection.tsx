import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export function FAQSection() {
  const faqs = [
    {
      id: "faq-1",
      question: "چگونه می‌توانم بیمه‌نامه خود را خریداری کنم؟",
      answer: "می‌توانید از طریق سایت ما، تماس تلفنی یا مراجعه به نمایندگی‌های ما نسبت به خرید بیمه‌نامه اقدام کنید. فرآیند آنلاین بسیار ساده و سریع است."
    },
    {
      id: "faq-2", 
      question: "مدت زمان پرداخت غرامت چقدر است؟",
      answer: "پس از تکمیل مدارک و بررسی پرونده، غرامت شما حداکثر ظرف ۷ روز کاری پرداخت می‌شود."
    },
    {
      id: "faq-3",
      question: "آیا امکان پرداخت اقساطی وجود دارد؟",
      answer: "بله، برای اکثر بیمه‌نامه‌ها امکان پرداخت اقساطی با شرایط مختلف وجود دارد. می‌توانید با کارشناسان ما جهت اطلاع از جزئیات تماس بگیرید."
    },
    {
      id: "faq-4",
      question: "چه مدارکی برای خرید بیمه لازم است؟",
      answer: "بسته به نوع بیمه، مدارک مختلفی نیاز است. معمولاً کارت ملی، شناسنامه و مدارک مربوط به موضوع بیمه (مانند کارت خودرو) لازم است."
    },
    {
      id: "faq-5",
      question: "آیا امکان تمدید آنلاین بیمه‌نامه وجود دارد؟",
      answer: "بله، می‌توانید از طریق پنل کاربری خود یا تماس با ما نسبت به تمدید بیمه‌نامه اقدام کنید."
    },
    {
      id: "faq-6",
      question: "در صورت تصادف چه اقداماتی باید انجام دهم؟",
      answer: "فوراً با شماره ۱۲۵ پلیس راه و سپس با مرکز تماس ما به شماره ۰۲۱-۱۲۳۴۵۶۷۸ تماس بگیرید. کارشناسان ما شما را راهنمایی خواهند کرد."
    }
  ];

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
            {faqs.map((faq) => (
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
        </div>
      </div>
    </section>
  );
}
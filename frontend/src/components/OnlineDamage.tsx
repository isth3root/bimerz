import { Button } from "./ui/button";

interface OnlineDamageProps {
  onNavigate: (page: string) => void;
}

export function OnlineDamage({ onNavigate }: OnlineDamageProps) {
  return (
    <section className="py-16 bg-gradient-to-br from-teal-400 to-green-400">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-right">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              خسارت آنلاین
            </h2>
            <p className="text-xl text-white mb-8">
              پرداخت آنلاین خسارت خودرو<br/>
              پرداخت خسارت بیمه نامه های بدنه و ثالث فقط با چند کلیک
            </p>
            <Button
              onClick={() => onNavigate('/yaqut-alborz')}
              className="bg-white text-teal-600 hover:bg-gray-100 font-semibold px-8 py-3"
            >
              شروع کنید
            </Button>
          </div>
          <div className="hidden lg:block">
            <img
              src="/dena.png"
              alt="Iranian Car"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
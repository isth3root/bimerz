import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { Copy, CheckCircle, Smartphone } from "lucide-react";
import { toast } from "sonner";
import api from '../utils/api';

interface TwoFactorSetupProps {
  secret: string;
  otpauthUrl: string;
  userId: number;
  role: string;
  onComplete: (data: { username: string; role: string }) => void;
  onBack: () => void;
}

export function TwoFactorSetup({ secret, userId, onComplete, onBack }: TwoFactorSetupProps) {
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('کپی شد');
      setTimeout(() => setCopied(false), 2000);
    } catch (err: any) {
      toast.error(err, 'خطا در کپی کردن');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      toast.error('کد ۲FA را وارد کنید');
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post('/auth/verify-2fa', {
        userId,
        code: twoFactorCode,
      });
      const data = response.data;
      toast.success('احراز هویت دو مرحله‌ای فعال شد');
      onComplete({ username: data.username || '', role: data.role || 'customer' });
    } catch (error: unknown) {
      console.error('2FA verification error:', error);
      toast.error('کد ۲FA نامعتبر است');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Smartphone className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">تنظیم احراز هویت دو مرحله‌ای</h1>
          <p className="text-gray-600 text-sm">کد امنیتی را در اپلیکیشن Google Authenticator تنظیم کنید</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg">کد امنیتی شما</CardTitle>
            <CardDescription>
              این کد را کپی کرده و در اپلیکیشن Google Authenticator وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Secret Display */}
            <div className="space-y-2">
              <Label>کد امنیتی (Secret Key)</Label>
              <div className="flex gap-2">
                <Input
                  value={secret}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(secret)}
                  className="shrink-0"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* QR Code Alternative */}
            <div className="space-y-2">
              <Label>یا کد QR را اسکن کنید</Label>
              <div className="bg-gray-50 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">در اپلیکیشن Google Authenticator:</p>
                <p className="text-xs text-gray-500">اضافه کردن → اسکن کد QR</p>
                <p className="text-xs text-gray-500 mt-1">یا کد امنیتی را به صورت دستی وارد کنید</p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">مراحل تنظیم:</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>اپلیکیشن Google Authenticator را باز کنید</li>
                <li>روی "اضافه کردن" کلیک کنید</li>
                <li>کد امنیتی بالا را کپی کرده و وارد کنید</li>
                <li>کد ۶ رقمی تولید شده را در زیر وارد کنید</li>
              </ol>
            </div>

            {/* 2FA Code Input */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>کد ۶ رقمی از اپلیکیشن</Label>
                <div className="flex justify-center" dir="ltr">
                  <InputOTP
                    maxLength={6}
                    value={twoFactorCode}
                    onChange={(value) => setTwoFactorCode(value)}
                    autoFocus
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-br from-teal-400 to-green-400"
                disabled={isLoading || twoFactorCode.length !== 6}
              >
                {isLoading ? 'در حال تایید...' : 'تایید و ادامه'}
              </Button>
            </form>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onBack}
            >
              بازگشت
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { TwoFactorSetup } from "./TwoFactorSetup";

import api from '../utils/api';

interface LoginPageProps {
  onLogin: (data: { username: string; role: 'customer' | 'admin' | 'admin-2' | 'admin-3' }) => void;
  onNavigate: (page: string) => void;
}

interface LoginResponse {
  username?: string;
  role?: 'customer' | 'admin' | 'admin-2' | 'admin-3';
  requires_2fa?: boolean;
  requires_setup?: boolean;
  secret?: string;
  otpauth_url?: string;
  userId?: number;
  message?: string;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [nationalCode, setNationalCode] = useState('');
  const [insuranceCode, setInsuranceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ nationalCode?: string; insuranceCode?: string; twoFactorCode?: string }>({});
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showSetup, setShowSetup] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [pendingLoginData, setPendingLoginData] = useState<LoginResponse | null>(null);

  const persianToEnglish = (str: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, (char) => persianNumbers.indexOf(char).toString());
  };

  const validateForm = () => {
    const newErrors: { nationalCode?: string; insuranceCode?: string } = {};
    const cleanedNationalCode = persianToEnglish(nationalCode).trim();
    if (!cleanedNationalCode) {
      newErrors.nationalCode = 'نام کاربری الزامی است';
    } else if (/^\d+$/.test(cleanedNationalCode) && cleanedNationalCode.length !== 10) {
      newErrors.nationalCode = 'کد ملی باید ۱۰ رقم باشد';
    } else if (!/^[a-zA-Z0-9]+$/.test(cleanedNationalCode)) {
      newErrors.nationalCode = 'نام کاربری فقط شامل حروف و اعداد انگلیسی باشد';
    }
    if (!insuranceCode.trim()) {
      newErrors.insuranceCode = 'رمز عبور الزامی است';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: persianToEnglish(nationalCode),
        password: persianToEnglish(insuranceCode),
      });
      const data: LoginResponse = response.data;

      if (data.requires_setup) {
        setPendingLoginData(data);
        setShowSetup(true);
        toast.info('احراز هویت دو مرحله‌ای را تنظیم کنید');
      } else if (data.requires_2fa) {
        setPendingLoginData(data);
        setShowTwoFactor(true);
        toast.info('کد احراز هویت دو مرحله‌ای را وارد کنید');
      } else {
        toast.success('ورود موفق');
        setErrors({});
        onLogin(data as { access_token: string; username: string; role: 'customer' | 'admin' | 'admin-2' | 'admin-3' });
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { status: number } };
      if (axiosError.response?.status === 403) {
        toast.error('حساب کاربری شما غیرفعال است. لطفا با ادمین تماس بگیرید.');
      } else {
        toast.error('اطلاعات ورود نامعتبر است');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorCode.trim()) {
      setErrors({ twoFactorCode: 'کد ۲FA الزامی است' });
      return;
    }
    setIsLoading(true);

    try {
      const response = await api.post('/auth/verify-2fa', {
        userId: pendingLoginData?.userId,
        code: twoFactorCode,
      });
      const data = response.data;
      toast.success('ورود موفق');
      setErrors({});
      setShowTwoFactor(false);
      setTwoFactorCode('');
      setPendingLoginData(null);
      onLogin({ username: data.username || '', role: (data.role as 'customer' | 'admin' | 'admin-2' | 'admin-3') || 'customer' });
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
         <div className="text-center mb-8">
           <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
             <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full object-cover" />
           </div>
           <h1 className="text-2xl text-gray-900 mb-2">بیمه البرز</h1>
           <p className="text-gray-600">ورود به سامانه</p>
         </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>ورود به حساب کاربری</CardTitle>
            <CardDescription>
              لطفاً کد ملی و شماره تماس  خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showSetup ? (
              <TwoFactorSetup
                secret={pendingLoginData?.secret || ''}
                otpauthUrl={pendingLoginData?.otpauth_url || ''}
                userId={pendingLoginData?.userId || 0}
                role={pendingLoginData?.role || ''}
                onComplete={(data) => {
                  setShowSetup(false);
                  setPendingLoginData(null);
                  onLogin({ username: data.username || '', role: (data.role as 'customer' | 'admin' | 'admin-2' | 'admin-3') || 'customer' });
                }}
                onBack={() => {
                  setShowSetup(false);
                  setPendingLoginData(null);
                  setErrors({});
                }}
              />
            ) : showTwoFactor ? (
              <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>کد احراز هویت دو مرحله‌ای</Label>
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
                  {errors.twoFactorCode && <p className="text-red-500 text-sm text-center">{errors.twoFactorCode}</p>}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-br from-teal-400 to-green-400 mt-6"
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال تایید...' : 'تایید'}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => {
                    setShowTwoFactor(false);
                    setTwoFactorCode('');
                    setPendingLoginData(null);
                    setErrors({});
                  }}
                >
                  بازگشت
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nationalCode">نام کاربری</Label>
                <Input
                  id="nationalCode"
                  type="text"
                  placeholder="کد ملی"
                  value={nationalCode}
                  onChange={(e) => setNationalCode(e.target.value)}
                  maxLength={10}
                  required
                  className="text-right"
                  aria-invalid={!!errors.nationalCode}
                  aria-describedby={errors.nationalCode ? "nationalCode-error" : undefined}
                />
                {errors.nationalCode && <p id="nationalCode-error" className="text-red-500 text-sm">{errors.nationalCode}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceCode">رمزعبور</Label>
                <div className="relative">
                  <Input
                    id="insuranceCode"
                    type={showPassword ? "text" : "password"}
                    placeholder="شماره تماس"
                    value={insuranceCode}
                    onChange={(e) => setInsuranceCode(e.target.value)}
                    required
                    className="text-right"
                    aria-invalid={!!errors.insuranceCode}
                    aria-describedby={errors.insuranceCode ? "insuranceCode-error" : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.insuranceCode && <p id="insuranceCode-error" className="text-red-500 text-sm">{errors.insuranceCode}</p>}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-br from-teal-400 to-green-400 mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </form>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="ghost"
                onClick={() => onNavigate('/')}
                className="text-gray-600 hover:text-gray-700"
              >
                <ArrowRight className="h-4 w-4 ml-2" />
                بازگشت به صفحه اصلی
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
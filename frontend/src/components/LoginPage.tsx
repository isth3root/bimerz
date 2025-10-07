import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import api from '../utils/api';

interface LoginPageProps {
  onLogin: (userType: 'customer' | 'admin' | 'admin-2' | 'admin-3') => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [nationalCode, setNationalCode] = useState('');
  const [insuranceCode, setInsuranceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const persianToEnglish = (str: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, (char) => persianNumbers.indexOf(char).toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', {
        username: persianToEnglish(nationalCode),
        password: persianToEnglish(insuranceCode),
      });
      const data = response.data;
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userId', data.username);
      localStorage.setItem('role', data.role);
      toast.success('ورود موفق');
      onLogin(data.role);
    } catch (error: unknown) {
      console.error('Login error:', error);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
         <div className="text-center mb-8">
           <div className="mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
             <img src="/logo.png" alt="Logo" className="w-16 h-16 rounded-full object-cover" />
           </div>
           <h1 className="text-2xl text-gray-900 mb-2">بیمه البرز</h1>
           <p className="text-gray-600">ورود به سامانه</p>
         </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>ورود به حساب کاربری</CardTitle>
            <CardDescription>
              لطفاً کد ملی و شماره تماس  خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
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
                />
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-br from-teal-400 to-green-400 mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </form>

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
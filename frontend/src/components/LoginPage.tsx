import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface LoginPageProps {
  onLogin: (userType: 'customer' | 'admin') => void;
  onNavigate: (page: string) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [nationalCode, setNationalCode] = useState('');
  const [insuranceCode, setInsuranceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: nationalCode,
          password: insuranceCode,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('userId', data.username);
        localStorage.setItem('role', data.role);
        toast.success('ورود موفق');
        onLogin(data.role);
      } else {
        toast.error('اطلاعات ورود نامعتبر است');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('ورود ناموفق');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl text-gray-900 mb-2">بیمه البرز</h1>
          <p className="text-gray-600">ورود به سامانه</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>ورود به حساب کاربری</CardTitle>
            <CardDescription>
              لطفاً کد ملی و کد بیمه‌گذار خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nationalCode">نام کاربری</Label>
                <Input
                  id="nationalCode"
                  type="text"
                  placeholder="نام کاربری"
                  value={nationalCode}
                  onChange={(e) => setNationalCode(e.target.value)}
                  maxLength={10}
                  required
                  className="text-right"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insuranceCode">رمزعبور</Label>
                <Input
                  id="insuranceCode"
                  type="password"
                  placeholder="رمزعبور"
                  value={insuranceCode}
                  onChange={(e) => setInsuranceCode(e.target.value)}
                  required
                  className="text-right"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700 mt-6"
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
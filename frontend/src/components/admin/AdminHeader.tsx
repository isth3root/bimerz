import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Users,
  FileText,
  CreditCard,
  Calendar,
  LogOut,
} from "lucide-react";

interface AdminHeaderProps {
  userRole: string;
  stats: {
    customersCount: number;
    policiesCount: number;
    overdueInstallmentsCount: number;
    nearExpiryPoliciesCount: number;
    nearExpiryInstallmentsCount: number;
  };
  statsLoaded: boolean;
  onLogout: () => void;
  token: string;
}

export function AdminHeader({ userRole, stats, statsLoaded, onLogout, token }: AdminHeaderProps) {
  const toPersianDigits = (str: string) => str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-400 to-green-400 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div>
                <h1 className="text-lg">پنل مدیریت</h1>
                <p className="text-sm text-gray-600">
                  سامانه مدیریت بیمه البرز
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {userRole === 'admin' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    try {
                      const response = await fetch(`${import.meta.env.VITE_PROD_URI}/admin/backup`, {
                        method: 'GET',
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      });
                      const blob = await response.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'backup.json';
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Error downloading backup:', error);
                    }
                  }}
                >
                  پشتیبان‌گیری
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('token'); onLogout(); }}>
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl mb-2">داشبورد مدیریت</h2>
        <p className="text-gray-600">مدیریت مشتریان، بیمه‌نامه‌ها و اقساط</p>
      </div>

      {/* Stats Cards */}
      {userRole === 'admin-3' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">کل مقالات</p>
                  <p className="text-3xl">۰</p>
                  <p className="text-sm text-green-600 mt-1">آمار به‌روز</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">امتیاز شما</p>
                  <p className="text-3xl">۰</p>
                  <p className="text-sm text-green-600 mt-1">امتیاز شخصی</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : userRole === 'admin-2' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">اقساط معوق</p>
                  <p className="text-3xl text-red-600">{toPersianDigits(stats.overdueInstallmentsCount.toString())}</p>
                  <p className="text-sm text-red-600 mt-1">آمار به‌روز</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">بیمه های نزدیک به انقضا</p>
                  <p className="text-3xl text-yellow-600">{toPersianDigits(stats.nearExpiryPoliciesCount.toString())}</p>
                  <p className="text-sm text-yellow-600 mt-1">در ۳۰ روز آینده</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">امتیاز شما</p>
                  <p className="text-3xl">۰</p>
                  <p className="text-sm text-green-600 mt-1">امتیاز شخصی</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {!statsLoaded ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-12 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">کل مشتریان</p>
                      <p className="text-3xl">{toPersianDigits(stats.customersCount.toString())}</p>
                      <p className="text-sm text-green-600 mt-1">آمار به‌روز</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        بیمه‌نامه‌های فعال
                      </p>
                      <p className="text-3xl">{toPersianDigits(stats.policiesCount.toString())}</p>
                      <p className="text-sm text-green-600 mt-1">آمار به‌روز</p>
                    </div>
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">اقساط معوق</p>
                      <p className="text-3xl text-red-600">{toPersianDigits(stats.overdueInstallmentsCount.toString())}</p>
                      <p className="text-sm text-red-600 mt-1">آمار به‌روز</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">بیمه های نزدیک به انقضا</p>
                      <p className="text-3xl text-yellow-600">{toPersianDigits(stats.nearExpiryPoliciesCount.toString())}</p>
                      <p className="text-sm text-yellow-600 mt-1">در ۳۰ روز آینده</p>
                    </div>
                    <Calendar className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </>
  );
}
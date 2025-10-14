import { useState, useEffect } from 'react';
import type { ComponentType } from 'react';
import moment from 'moment-jalaali';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import api from '../utils/api';
import {
  Car,
  Shield,
  Flame,
  User,
  Calendar,
  CreditCard,
  FileText,
  Phone,
  LogOut,
  Copy,
  Heart,
  ShieldAlert,
} from "lucide-react";

interface Customer {
  id: number;
  full_name: string;
  national_code: string;
  insurance_code: string;
  phone: string;
  birth_date: string;
  score: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface RawPolicy {
  id: number;
  insurance_type: string;
  details: string;
  start_date: string | null;
  end_date: string | null;
  status: string;
  payment_type: string;
  payment_id: string | null;
  payment_link: string | null;
  pdf_path: string | null;
}

interface Policy {
  id: number;
  type: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  status: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  isInstallment: boolean;
  payId: string | undefined;
  payLink: string | undefined;
  hasPdf: boolean;
}

interface RawInstallment {
  id: number;
  due_date: string;
  status: string;
  pay_link: string;
  policy_id: number;
  installment_number: number;
  amount: string;
  policy: {
    insurance_type: string;
  } | null;
}

interface CustomerDashboardProps {
  onLogout: () => void;
}

export function CustomerDashboard({ onLogout }: CustomerDashboardProps) {
  const [insurancePolicies, setInsurancePolicies] = useState<Policy[]>([]);
  const [allInstallments, setAllInstallments] = useState<RawInstallment[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState({
    overdueCount: 0,
    nearExpiryPoliciesCount: 0,
  });
  const [, setLoading] = useState(true);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [showInstallmentsDialog, setShowInstallmentsDialog] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      if (!token || !userId) return;
      try {
        setLoading(true);
        let nearExpiryPoliciesCount = 0;
        let overdueCount = 0;
        const [
          customerData,
          policiesData,
          installmentsData,
        ] = await Promise.all([
          api.get(`/admin/customers/by-national/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.data),
          api.get('/customer/policies', {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.data),
          api.get('/installments/customer', {
            headers: { Authorization: `Bearer ${token}` },
          }).then(res => res.data),
        ]);

        setCustomer(customerData);

        const policies: Policy[] = policiesData.map((p: RawPolicy) => {
          let icon, color, bgColor;
          switch (p.insurance_type) {
            case 'ثالث': icon = Car; color = 'text-blue-600'; bgColor = 'bg-blue-100'; break;
            case 'بدنه': icon = Shield; color = 'text-green-600'; bgColor = 'bg-green-100'; break;
            case 'آتش‌سوزی': icon = Flame; color = 'text-red-600'; bgColor = 'bg-red-100'; break;
            case 'حوادث': icon = User; color = 'text-yellow-600'; bgColor = 'bg-yellow-100'; break;
            case 'زندگی': icon = Heart; color = 'text-pink-600'; bgColor = 'bg-pink-100'; break;
            case 'مسئولیت': icon = ShieldAlert; color = 'text-indigo-600'; bgColor = 'bg-indigo-100'; break;
            default: icon = FileText; color = 'text-gray-600'; bgColor = 'bg-gray-100';
          }
          return {
            id: p.id,
            type: p.insurance_type,
            vehicle: p.details,
            startDate: p.start_date || '',
            endDate: p.end_date || '',
            status: p.status,
            icon,
            color,
            bgColor,
            isInstallment: p.payment_type === 'اقساطی',
            payId: p.payment_id,
            payLink: p.payment_link,
            hasPdf: !!p.pdf_path,
          };
        });
        nearExpiryPoliciesCount = policies.filter(p => p.status === 'نزدیک انقضا').length;
        setInsurancePolicies(policies);

        const processedInstallments: RawInstallment[] = installmentsData.map((inst: RawInstallment) => {
          const momentDueDate = moment(inst.due_date, "jYYYY/jMM/jDD");
          let status = inst.status;
          if (status !== 'پرداخت شده') {
            if (momentDueDate.isBefore(moment(), 'day')) {
              status = 'معوق';
              overdueCount++;
            } else {
              status = 'آینده';
            }
          }
          return {
            ...inst,
            status,
            pay_link: inst.pay_link,
          };
        });
        setAllInstallments(processedInstallments);
        setStats({ overdueCount, nearExpiryPoliciesCount });
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("خطا در بارگیری اطلاعات پنل");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, userId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'فعال': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">فعال</Badge>;
      case 'نزدیک انقضا': return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">نزدیک انقضا</Badge>;
      case 'منقضی': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">منقضی</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'پرداخت شده': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">پرداخت شده</Badge>;
      case 'معوق': return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">معوق</Badge>;
      case 'آینده': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">آینده</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('شناسه پرداخت کپی شد!');
    } catch (err) {
      console.error(err)
      toast.error('خطا در کپی کردن');
    }
  };

  const handlePayLink = (link: string | undefined) => {
    if (!link) return;
    let absoluteUrl = link;
    if (!/^https?:\/\//i.test(link)) {
      absoluteUrl = `https://${link}`;
    }
    window.open(absoluteUrl, '_blank');
  };

  const getScoreDescription = (score: string | undefined) => {
    if (!score) return '';
    switch (score) {
      case 'A': return 'عالی';
      case 'B': return 'خوب';
      case 'C': return 'متوسط';
      case 'D': return 'ضعیف';
      default: return '';
    }
  };

  const toPersianDigits = (str: string) => str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gradient-to-br from-teal-400 to-green-400 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                 <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div>
                <h1 className="text-lg">پنل مشتری</h1>
                <p className="text-sm text-black">{customer?.full_name || 'کاربر'}</p>
              </div>
            </div>
            <div className="flex items-center">
              <a href="tel:+989385540717">
                <Button variant="ghost" size="sm">
                  <Phone className="h-4 w-4 ml-2" />
                  پشتیبانی
                </Button>
              </a>
              <Button variant="ghost" size="sm" onClick={onLogout}>
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl mb-2">خوش آمدید، {customer?.full_name || 'کاربر'}</h2>
          <p className="text-gray-600">وضعیت بیمه‌نامه‌ها و اقساط خود را مشاهده کنید</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">بیمه‌نامه‌های فعال</p>
                  <p className="text-2xl">{toPersianDigits(insurancePolicies.filter(p => p.status === 'فعال').length.toString())}</p>
                </div>
                <FileText className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">اقساط معوق</p>
                  <p className="text-2xl text-red-600">{toPersianDigits(stats.overdueCount.toString())}</p>
                </div>
                <CreditCard className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">بیمه های نزدیک به انقضا</p>
                  <p className="text-2xl text-yellow-600">{toPersianDigits(stats.nearExpiryPoliciesCount.toString())}</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">امتیاز بیمه‌گذار</p>
                  <div className="flex flex-row-reverse justify-center items-center gap-4">
                    <span className={`text-lg font-bold ${
                      customer?.score === 'A' ? 'text-green-600' :
                      customer?.score === 'B' ? 'text-blue-600' :
                      customer?.score === 'C' ? 'text-orange-600' :
                      'text-red-600'
                    }`}>{getScoreDescription(customer?.score)}</span>
                    {['A', 'B', 'C', 'D'].map((score) => (
                      <span
                        key={score}
                        className={`${
                          score === customer?.score
                            ? score === 'A' ? 'text-green-600 font-bold text-3xl rounded-full bg-green-100 w-12 h-12 flex items-center justify-center'
                            : score === 'B' ? 'text-blue-600 font-bold text-3xl rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center'
                            : score === 'C' ? 'text-orange-600 font-bold text-3xl rounded-full bg-orange-100 w-12 h-12 flex items-center justify-center'
                            : 'text-red-600 font-bold text-3xl rounded-full bg-red-100 w-12 h-12 flex items-center justify-center'
                            : score === 'A' ? 'text-green-400 font-light text-sm'
                            : score === 'B' ? 'text-blue-400 font-light text-sm'
                            : score === 'C' ? 'text-orange-400 font-light text-sm'
                            : 'text-red-400 font-light text-sm'
                        }`}
                      >
                        {score}
                      </span>
                    ))}
                  </div>
                </div>
                <User className={`h-8 w-8 ${
                  customer?.score === 'A' ? 'text-green-600' :
                  customer?.score === 'B' ? 'text-blue-600' :
                  customer?.score === 'C' ? 'text-orange-600' :
                  'text-red-600'
                }`} />
              </div>
            </CardContent>
          </Card>
        </div>
            <p className="text-center text-red-600 font-bold py-10">وضعیت اقساط پرداخت شده حداکثر ظرف ۷۲ ساعت تایید میگردد</p>
        <Card className="mb-8 bg-gradient-to-br from-teal-200 to-green-200">
          <CardHeader>
            <CardTitle>بیمه‌نامه‌های من</CardTitle>
            <CardDescription>لیست بیمه‌نامه‌های فعال و وضعیت آنها</CardDescription>
          </CardHeader>
          <CardContent>
            {insurancePolicies.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">شما هنوز بیمه‌نامه‌ای ندارید</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {insurancePolicies
                  .sort((a, b) => {
                    const aExpired = a.status === 'منقضی';
                    const bExpired = b.status === 'منقضی';
                    if (aExpired && !bExpired) return 1;
                    if (!aExpired && bExpired) return -1;
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                  })
                  .map((policy) => {
                  const IconComponent = policy.icon;
                  return (
                    <Card key={policy.id} className="border-0 shadow-md">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 rounded-full ${policy.bgColor}`}>
                            <IconComponent className={`h-6 w-6 ${policy.color}`} />
                          </div>
                          {getStatusBadge(policy.status)}
                        </div>
                        <CardTitle className="text-lg">{policy.type}</CardTitle>
                        <CardDescription>{policy.vehicle}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col justify-between h-full">
                        <div className="space-y-2 text-sm">
                          {policy.payId && (
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">شناسه پرداخت:</span>
                              <div className="flex items-center gap-1">
                                <span>{toPersianDigits(policy.payId!)}</span>
                                <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => copyToClipboard(policy.payId!)}>
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-gray-600">شروع:</span>
                            <span>{toPersianDigits(policy.startDate)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">انقضا:</span>
                            <span>{toPersianDigits(policy.endDate)}</span>
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          {policy.hasPdf && (
                            <Button size="sm" variant="outline" className={policy.isInstallment ? "flex-1" : "w-full"} onClick={async () => {
                              try {
                                const response = await api.get(`/customer/policies/${policy.id}/download`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                  responseType: 'blob',
                                });
                                const blob = response.data;
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = `policy-${policy.id}.pdf`;
                                a.click();
                                window.URL.revokeObjectURL(url);
                              } catch (error) {
                                console.error(error)
                                toast.error('خطا در دانلود فایل');
                              }
                            }}>
                              {/* <Download className="h-4 w-4" /> */}
                              دانلود بیمه نامه
                            </Button>
                          )}
                          {policy.isInstallment && (
                            <>
                              <Button size="sm" variant="outline" className={policy.payLink ? "flex-1" : "flex-1"} onClick={() => {
                                setSelectedPolicy(policy);
                                setShowInstallmentsDialog(true);
                              }}>
                                اقساط
                              </Button>
                              {policy.payLink && (
                                <Button size="sm" className="flex-1" onClick={() => handlePayLink(policy.payLink)}>
                                  {/* <CreditCard className="h-4 w-4 ml-2" /> */}
                                  پرداخت
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8 shadow-green-100 shadow-xl ring-2 ring-green-200">
          <CardHeader>
            <CardTitle>اقساط</CardTitle>
            <CardDescription>لیست تمام اقساط پرداخت نشده</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className='text-right'>بیمه</TableHead>
                  <TableHead className='text-right'>وضعیت</TableHead>
                  <TableHead className='text-right'>سررسید</TableHead>
                  <TableHead className='text-right'>مبلغ</TableHead>
                  <TableHead className='text-right'>شماره</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allInstallments.filter(inst => inst.status !== 'پرداخت شده').length > 0 ? (
                  allInstallments
                    .filter(inst => inst.status !== 'پرداخت شده')
                    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
                    .slice(0, 5)
                    .map(installment => (
                    <TableRow key={installment.id}>
                      <TableCell>{installment.policy?.insurance_type || 'N/A'}</TableCell>
                      <TableCell>{getPaymentStatusBadge(installment.status)}</TableCell>
                      <TableCell>{toPersianDigits(installment.due_date)}</TableCell>
                      <TableCell>
                        {toPersianDigits(parseFloat(installment.amount).toLocaleString('fa-IR'))} ریال
                      </TableCell>
                      <TableCell>{toPersianDigits(installment.installment_number.toString())}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      شما هیچ قسط پرداخت نشده‌ای ندارید.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={showInstallmentsDialog} onOpenChange={setShowInstallmentsDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>اقساط بیمه‌نامه</DialogTitle>
              <DialogDescription>لیست اقساط بیمه‌نامه {selectedPolicy?.type}</DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='text-right'>شماره</TableHead>
                    <TableHead className='text-right'>مبلغ</TableHead>
                    <TableHead className='text-right'>سررسید</TableHead>
                    <TableHead className='text-right'>وضعیت</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedPolicy && allInstallments.filter(inst => inst.policy_id === selectedPolicy.id).length > 0 ? (
                    allInstallments
                      .filter(inst => inst.policy_id === selectedPolicy.id)
                      .sort((a, b) => a.installment_number - b.installment_number)
                      .map((installment) => (
                      <TableRow key={installment.id}>
                        <TableCell>{toPersianDigits(installment.installment_number.toString())}</TableCell>
                        <TableCell>{toPersianDigits(parseFloat(installment.amount).toLocaleString('fa-IR'))} ریال</TableCell>
                        <TableCell>{toPersianDigits(installment.due_date)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(installment.status)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        این بیمه‌نامه قسطی نیست یا اقساطی برای آن ثبت نشده است.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
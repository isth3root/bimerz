import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { motion } from "framer-motion";
import type { Blog } from "../hooks/useBlogs";
import { CustomersTab } from "./admin/CustomersTab";
import { PoliciesTab } from "./admin/PoliciesTab";
import { InstallmentsTab } from "./admin/InstallmentsTab";
import { BlogsTab } from "./admin/BlogsTab";
import api from '../utils/api';
import moment from "moment-jalaali";
import { User, FileText, CreditCard, Calendar } from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Customer {
  id: string;
  name: string;
  nationalCode: string;
  phone: string;
  email: string;
  birthDate: string;
  joinDate: string;
  activePolicies: number;
  status: string;
  score: 'A' | 'B' | 'C' | 'D';
  password?: string;
  role?: string;
}

interface Policy {
  id: string;
  customerName: string;
  customerNationalCode?: string;
  policyNumber?: string;
  type: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  premium: string;
  status: string;
  paymentType: string;
  payId?: string;
  paymentLink?: string;
  installmentsCount?: number;
  installment_type?: string;
  first_installment_amount?: string;
  pdfFile?: File | null;
}

interface Installment {
  id: string;
  customerName: string;
  policyType: string;
  amount: string;
  dueDate: string;
  status: string;
  daysOverdue: number;
  installment_number: number;
  payLink?: string;
  customerNationalCode?: string;
}

interface CustomerAPI {
  id: number;
  full_name: string;
  national_code: string;
  phone: string;
  birth_date?: string;
  score?: string;
  insurance_code?: string;
  created_at?: string;
  role?: string;
  status?: string;
}

interface PolicyAPI {
  id: number;
  customer?: {
    full_name: string;
    national_code: string;
  };
  policy_number?: string;
  insurance_type: string;
  details: string;
  start_date?: string;
  end_date?: string;
  premium: string;
  status: string;
  payment_type: string;
  payment_id?: string;
  payment_link?: string;
  installment_count?: number;
  installment_type?: string;
  first_installment_amount?: string;
}

interface InstallmentAPI {
  id: number;
  customer?: {
    full_name: string;
    national_code: string;
  };
  policy?: {
    insurance_type: string;
  };
  amount: string;
  due_date: string;
  status: string;
  pay_link?: string;
  installment_number: number;
}

interface BlogAPI {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  created_at: string;
  image_path: string;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [loadingInstallments, setLoadingInstallments] = useState(true);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [stats, setStats] = useState({
    customersCount: 0,
    policiesCount: 0,
    overdueInstallmentsCount: 0,
    nearExpiryPoliciesCount: 0,
    nearExpiryInstallmentsCount: 0,
  });

  const [activeTab, setActiveTab] = useState(() => {
    const role = localStorage.getItem('role') || 'admin';
    if (role === 'admin-3') return 'blogs';
    if (role === 'admin-2') return 'installments';
    return 'customers';
  });

  const userRole = localStorage.getItem('role') || 'admin';
  const visibleTabs = userRole === 'admin' ? ['customers', 'policies', 'installments', 'blogs'] :
    userRole === 'admin-2' ? ['installments', 'blogs'] :
    userRole === 'admin-3' ? ['blogs'] :
    ['customers', 'policies', 'installments', 'blogs'];
  const cols = visibleTabs.length;
  const tabIndex = visibleTabs.indexOf(activeTab);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.map((blog: BlogAPI) => ({
          id: blog.id.toString(),
          title: blog.title,
          summary: blog.summary,
          content: blog.content,
          category: blog.category,
          date: new Date(blog.created_at).toLocaleDateString('fa-IR'),
          image_path: blog.image_path,
        }));
        setBlogs(data);
        setLoadingBlogs(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    const fetchCustomers = async () => {
      try {
        const response = await api.get('/admin/customers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (!Array.isArray(data)) {
          console.error('Expected array for customers data');
          return;
        }
        setCustomers(data.map((c: CustomerAPI) => ({
          id: c.id ? c.id.toString() : '',
          name: c.full_name,
          nationalCode: c.national_code,
          phone: c.phone,
          email: '',
          birthDate: c.birth_date || '',
          joinDate: c.created_at ? new Date(c.created_at).toLocaleDateString('fa-IR') : '',
          activePolicies: 0, // Calculate or fetch separately
          status: c.status || 'فعال',
          score: (c.score as 'A' | 'B' | 'C' | 'D') || 'A',
          password: c.insurance_code,
          role: c.role || 'customer',
        })));
      } catch (error) {
        console.error('Error fetching customers:', error);
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('token');
          onLogout();
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchPolicies = async () => {
      try {
        const response = await api.get('/admin/policies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        if (!Array.isArray(data)) {
          console.error('Expected array for policies data');
          return;
        }
        setPolicies(data.map((p: PolicyAPI) => ({
          id: p.id.toString(),
          customerName: p.customer ? p.customer.full_name : 'Unknown',
          customerNationalCode: p.customer ? p.customer.national_code : '',
          policyNumber: p.policy_number,
          type: p.insurance_type,
          vehicle: p.details,
          startDate: p.start_date || '',
          endDate: p.end_date || '',
          premium: p.premium.toString(),
          status: p.status,
          paymentType: p.payment_type,
          payId: p.payment_id,
          paymentLink: p.payment_link,
          installmentsCount: p.installment_count,
          installment_type: p.installment_type,
          first_installment_amount: p.first_installment_amount,
          pdfFile: null,
        })));

        // Update customers with active policies count
        setCustomers(prevCustomers =>
          prevCustomers.map(customer => ({
            ...customer,
            activePolicies: data.filter((p: PolicyAPI) => p.customer && p.customer.national_code === customer.nationalCode).length,
          }))
        );

        // Fetch stats
        const [
          customersCountData,
          policiesCountData,
          overdueData,
          nearExpiryData,
          nearExpiryInstallmentsData,
        ] = await Promise.all([
          api.get('/admin/customers/count', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data).catch(() => 0),
          api.get('/count', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data).catch(() => 0),
          api.get('/installments/overdue/count', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data).catch(() => 0),
          api.get('/admin/policies/near-expiry/count', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data).catch(() => 0),
          api.get('/installments/near-expiry/count', { headers: { Authorization: `Bearer ${token}` } }).then(res => res.data).catch(() => 0),
        ]);

        const customersCount = typeof customersCountData === 'object' && customersCountData.count !== undefined ? customersCountData.count : customersCountData;
        const policiesCount = typeof policiesCountData === 'object' && policiesCountData.count !== undefined ? policiesCountData.count : policiesCountData;
        const overdueInstallmentsCount = typeof overdueData === 'object' && overdueData.count !== undefined ? overdueData.count : overdueData;
        const nearExpiryPoliciesCount = typeof nearExpiryData === 'object' && nearExpiryData.count !== undefined ? nearExpiryData.count : nearExpiryData;
        const nearExpiryInstallmentsCount = typeof nearExpiryInstallmentsData === 'object' && nearExpiryInstallmentsData.count !== undefined ? nearExpiryInstallmentsData.count : nearExpiryInstallmentsData;

        setStats({
          customersCount,
          policiesCount,
          overdueInstallmentsCount,
          nearExpiryPoliciesCount,
          nearExpiryInstallmentsCount,
        });
        setStatsLoaded(true);
        setLoadingPolicies(false);
      } catch (error) {
        console.error('Error fetching policies:', error);
        if (error instanceof Error && error.message.includes('401')) {
          localStorage.removeItem('token');
          onLogout();
        }
      }
    };

    if (!token) {
      console.error("token not found");
      onLogout();
      return;
    }

    if (token) {
      fetchCustomers();
      fetchPolicies();
      fetchBlogs();
    }
  }, [token, onLogout]);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const response = await api.get('/admin/installments', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        if (!Array.isArray(data)) {
          console.error('Expected array for installments data');
          return;
        }
          const now = moment();
          const processedInstallments = data.map((i: InstallmentAPI) => {
            const dueDateMoment = moment(i.due_date, "jYYYY/jMM/jDD");
            let status = i.status;
            if (status !== 'پرداخت شده') {
              if (dueDateMoment.isBefore(now)) {
                status = "معوق";
              } else {
                status = "آینده";
              }
            }
            const daysOverdue = status === 'معوق' ? now.diff(dueDateMoment, 'days') : 0;

            return {
              id: i.id.toString(),
              customerName: i.customer ? i.customer.full_name : 'Unknown',
              policyType: i.policy ? i.policy.insurance_type : 'Unknown',
              amount: i.amount.toString(),
              dueDate: i.due_date,
              status,
              daysOverdue,
              installment_number: i.installment_number,
              payLink: i.pay_link || '',
              customerNationalCode: i.customer ? i.customer.national_code : '',
            };
          });
          setInstallments(processedInstallments);
          setLoadingInstallments(false);
      } catch (error) {
        console.error('Error fetching installments:', error);
      }
    };

    if (token && customers.length > 0 && policies.length > 0) {
      fetchInstallments();
    }
  }, [token, customers, policies]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-teal-400 to-green-400 shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-10 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              </div>
              <div>
                {loading ? (
                  <>
                    <div className="h-6 w-24 bg-gray-200 rounded mb-1" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </>
                ) : (
                  <>
                    <h1 className="text-lg">پنل مدیریت</h1>
                    <p className="text-sm text-gray-600">
                      سامانه مدیریت بیمه البرز
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="px-3 py-2 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors"
                onClick={() => { localStorage.removeItem('token'); onLogout(); }}
              >
                خروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          {loading ? (
            <>
              <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </>
          ) : (
            <>
              <h2 className="text-2xl mb-2">داشبورد مدیریت</h2>
              <p className="text-gray-600">مدیریت مشتریان، بیمه‌نامه‌ها و اقساط</p>
            </>
          )}
        </div>

        {/* Stats Cards */}
        {userRole === 'admin-3' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {!loadingBlogs ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">کل مقالات</p>
                      <p className="text-3xl">{blogs.length.toString()}</p>
                      <p className="text-sm text-green-600 mt-1">آمار به‌روز</p>
                    </div>
                      <FileText className="text-blue-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">امتیاز شما</p>
                      {(() => {
                        const currentUser = customers.find(c => c.nationalCode === localStorage.getItem('userId'));
                        const score = currentUser?.score;
                        const scoreText = score === 'A' ? 'عالی' : score === 'B' ? 'خوب' : score === 'C' ? 'متوسط' : 'ضعیف';
                        const scoreColor = score === 'A' ? 'text-green-600' : score === 'B' ? 'text-blue-600' : score === 'C' ? 'text-orange-600' : 'text-red-600';
                        return <p className={`text-3xl ${scoreColor}`}>{scoreText}</p>;
                      })()}
                      <p className="text-sm text-green-600 mt-1">امتیاز شخصی</p>
                    </div>
                      <User className="text-blue-600" />
                  </div>
                </div>
              </>
            ) : (
              Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-12 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : userRole === 'admin-2' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {!loading ? (
              <>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">اقساط معوق</p>
                      <p className="text-3xl text-red-600">{stats.overdueInstallmentsCount.toString()}</p>
                      <p className="text-sm text-red-600 mt-1">آمار به‌روز</p>
                    </div>
                      <CreditCard className="text-red-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">بیمه های نزدیک به انقضا</p>
                      <p className="text-3xl text-yellow-600">{stats.nearExpiryPoliciesCount.toString()}</p>
                      <p className="text-sm text-yellow-600 mt-1">در ۳۰ روز آینده</p>
                    </div>
                      <Calendar className="text-yellow-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">امتیاز شما</p>
                      {(() => {
                        const currentUser = customers.find(c => c.nationalCode === localStorage.getItem('userId'));
                        const score = currentUser?.score;
                        const scoreText = score === 'A' ? 'عالی' : score === 'B' ? 'خوب' : score === 'C' ? 'متوسط' : 'ضعیف';
                        const scoreColor = score === 'A' ? 'text-green-600' : score === 'B' ? 'text-blue-600' : score === 'C' ? 'text-orange-600' : 'text-red-600';
                        return <p className={`text-3xl ${scoreColor}`}>{scoreText}</p>;
                      })()}
                      <p className="text-sm text-green-600 mt-1">امتیاز شخصی</p>
                    </div>
                      <User className="text-blue-600" />
                  </div>
                </div>
              </>
            ) : (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-12 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {!statsLoaded ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex-1">
                    <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
                    <div className="h-8 w-12 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">کل مشتریان</p>
                      <p className="text-3xl">{customers.filter(c => (c.role || 'customer') === 'customer').length.toString()}</p>
                      <p className="text-sm text-green-600 mt-1">آمار به‌روز</p>
                    </div>
                      <span className="text-blue-600 w-8 h-8"><User /></span>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">
                        بیمه‌نامه‌های فعال
                      </p>
                      <p className="text-3xl">{stats.policiesCount.toString()}</p>
                      <p className="text-sm text-green-600 mt-1">آمار به‌روز</p>
                    </div>
                      <FileText className="text-green-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">اقساط معوق</p>
                      <p className="text-3xl text-red-600">{stats.overdueInstallmentsCount.toString()}</p>
                      <p className="text-sm text-red-600 mt-1">آمار به‌روز</p>
                    </div>
                      <CreditCard className="text-red-600" />
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">بیمه های نزدیک به انقضا</p>
                      <p className="text-3xl text-yellow-600">{stats.nearExpiryPoliciesCount.toString()}</p>
                      <p className="text-sm text-yellow-600 mt-1">در ۳۰ روز آینده</p>
                    </div>
                      <Calendar className="text-yellow-600" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Management Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className={`relative grid w-full ${cols === 1 ? 'grid-cols-1' : cols === 2 ? 'grid-cols-2' : cols === 3 ? 'grid-cols-3' : 'grid-cols-4'} p-1 rounded-lg`}>
            <motion.div
              className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm"
              style={{ width: `calc(${100/cols}% - 4px)` }}
              animate={{ left: `calc(${tabIndex} * ${100/cols}% + 2px)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            {visibleTabs.includes('customers') && <TabsTrigger
              value="customers"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              کاربران
            </TabsTrigger>}
            {visibleTabs.includes('policies') && <TabsTrigger
              value="policies"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              بیمه‌نامه‌ها
            </TabsTrigger>}
            {visibleTabs.includes('installments') && <TabsTrigger
              value="installments"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              اقساط
            </TabsTrigger>}
            {visibleTabs.includes('blogs') && <TabsTrigger
              value="blogs"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              اخبار
            </TabsTrigger>}
          </TabsList>

          <CustomersTab
            customers={customers}
            setCustomers={setCustomers}
            loading={loading}
            token={token || ''}
          />

          <PoliciesTab
            policies={policies}
            setPolicies={setPolicies}
            customers={customers}
            loadingPolicies={loadingPolicies}
            token={token || ''}
            onLogout={onLogout}
          />

          <InstallmentsTab
            installments={installments}
            setInstallments={setInstallments}
            loading={loadingInstallments}
            token={token || ''}
          />

          <BlogsTab
            blogs={blogs}
            setBlogs={setBlogs}
            loading={loadingBlogs}
            token={token || ''}
          />
        </Tabs>
      </div>
    </div>
  );
}
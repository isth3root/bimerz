import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Label } from "./ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import { PriceInput } from "./PriceInput";
import { useBlogs } from "../hooks/useBlogs";
import { motion, AnimatePresence } from "framer-motion";
import type { Blog } from "../data/blogsData";
import {
  Users,
  FileText,
  CreditCard,
  Search,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import api from '../utils/api';
import { DatePicker } from "zaman";
import moment from "moment-jalaali";

// Client-only Persian date picker component using zaman
const ClientOnlyDatePicker = React.forwardRef<HTMLDivElement, {
  value: string;
  onChange: (date: string) => void;
  placeholder: string;
  id?: string;
}>(({
  value,
  onChange,
  placeholder,
  id,
}, ref) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Convert Persian numbers to English
  const persianToEnglish = (str: string): string => {
    const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return str.replace(/[۰-۹]/g, (char) => persianNumbers.indexOf(char).toString());
  };

  // Convert Persian date string to Date object
  const parsePersianDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const englishDateStr = persianToEnglish(dateStr);
    const m = moment(englishDateStr, "jYYYY/jMM/jDD");
    return m.isValid() ? m.toDate() : undefined;
  };

  // Convert Date object to Persian date string
  const formatPersianDate = (date: Date): string => {
    return moment(date).format("jYYYY/jMM/jDD");
  };

  const handleDateChange = (e: { value: Date }) => {
    const persianDate = formatPersianDate(e.value);
    onChange(persianDate);
  };

  if (!isClient) {
    return (
      <div ref={ref} id={id} className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span>{placeholder}</span>
      </div>
    );
  }

  const parsedDate = parsePersianDate(value);
  return (
    <div ref={ref} id={id}>
      <DatePicker
        defaultValue={parsedDate || undefined}
        onChange={handleDateChange}
        className="w-full"
        inputClass="flex items-center gap-2 border rounded-md px-3 py-2 text-sm bg-white"
        inputAttributes={{
          placeholder: placeholder,
          style: { direction: "rtl" },
          value: value,
          onChange: (e) => onChange(e.target.value),
        }}
      />
    </div>
  );
});

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
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { blogs, addBlog, updateBlog, deleteBlog } = useBlogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [, setLoading] = useState(true);
  const [stats, setStats] = useState({
    customersCount: 0,
    policiesCount: 0,
    overdueInstallmentsCount: 0,
    nearExpiryPoliciesCount: 0,
    nearExpiryInstallmentsCount: 0,
  });

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    nationalCode: "",
    insuranceCode: "",
    phone: "",
    email: "",
    birthDate: "",
    score: "A" as 'A' | 'B' | 'C' | 'D',
  });
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);

  const [policySearchQuery, setPolicySearchQuery] = useState("");
  
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null);
  const [formDataPolicy, setFormDataPolicy] = useState({
    customerName: "",
    customerNationalCode: "",
    policyNumber: "",
    type: "",
    vehicle: "",
    startDate: "",
    endDate: "",
    premium: "",
    status: "فعال",
    paymentType: "اقساطی",
    payId: "",
    paymentLink: "",
    installmentsCount: 0,
    pdfFile: null as File | null,
  });
  const [deletePolicy, setDeletePolicy] = useState<Policy | null>(null);
  const [showAddPolicyForm, setShowAddPolicyForm] = useState(false);
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [editingInstallment, setEditingInstallment] =
    useState<Installment | null>(null);
  const [formDataInstallment, setFormDataInstallment] = useState({
    customerName: "",
    customerNationalCode: "",
    policyType: "",
    amount: "",
    dueDate: "",
    payLink: "",
    status: "معوق",
  });
  const [deleteInstallment, setDeleteInstallment] =
    useState<Installment | null>(null);
  const [showAddInstallmentForm, setShowAddInstallmentForm] = useState(false);

  const [installmentSearchQuery, setInstallmentSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formDataBlog, setFormDataBlog] = useState({
    title: "",
    excerpt: "",
    content: "",
    date: "",
    imageUrl: "",
    category: "",
  });
  const [activeTab, setActiveTab] = useState("customers");
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {

    if (!token) {
      console.error("token not found");
      onLogout();
      return;
    }

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
        status: 'فعال', // Default
        score: (c.score as 'A' | 'B' | 'C' | 'D') || 'A',
        password: c.insurance_code,
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
        startDate: p.start_date ? moment(p.start_date).format("jYYYY/jMM/jDD") : '',
        endDate: p.end_date ? moment(p.end_date).format("jYYYY/jMM/jDD") : '',
        premium: p.premium.toString(),
        status: p.status,
        paymentType: p.payment_type,
        payId: p.payment_id,
        paymentLink: p.payment_link,
        installmentsCount: p.installment_count,
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
    } catch (error) {
      console.error('Error fetching policies:', error);
      if (error instanceof Error && error.message.includes('401')) {
        localStorage.removeItem('token');
        onLogout();
      }
    }
  };

    if (token) {
      fetchCustomers();
      fetchPolicies();
    }
  }, [token, onLogout]);

  useEffect(() => {
    const fetchInstallments = async () => {
      try {
        const response = await api.get('/installments/admin', {
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
            const dueDate = new Date(i.due_date);
            const dueDateMoment = moment(i.due_date);
            const daysOverdue = dueDateMoment.isBefore(now) ? now.diff(dueDateMoment, 'days') : 0;

            let status = i.status;
            if (status !== 'پرداخت شده') {
              if (dueDateMoment.isBefore(now)) {
                status = "معوق";
              } else {
                status = "آینده";
              }
            }

            return {
              id: i.id.toString(),
              customerName: i.customer ? i.customer.full_name : 'Unknown',
              policyType: i.policy ? i.policy.insurance_type : 'Unknown',
              amount: i.amount.toString(),
              dueDate: moment(dueDate).format("jYYYY/jMM/jDD"),
              status,
              daysOverdue,
              payLink: i.pay_link || '',
              customerNationalCode: i.customer ? i.customer.national_code : '',
            };
          });
          setInstallments(processedInstallments);
      } catch (error) {
        console.error('Error fetching installments:', error);
      }
    };

    if (token && customers.length > 0 && policies.length > 0) {
      fetchInstallments();
    }
  }, [token, customers, policies]);

  useEffect(() => {
    if (formDataPolicy.startDate) {
      const startDate = moment(formDataPolicy.startDate, "jYYYY/jMM/jDD");
      if (startDate.isValid()) {
        const endDate = startDate.add(1, "year").format("jYYYY/jMM/jDD");
        setFormDataPolicy((prev) => ({ ...prev, endDate }));
      }
    }
  }, [formDataPolicy.startDate]);



  const tabIndex =
    { customers: 0, policies: 1, installments: 2, blogs: 3 }[activeTab] || 0;

  const formatPrice = (price: string) => {
    if (!price) return "0 ریال";
    const integerPart = String(price).split('.')[0];
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted} ریال`;
  };


  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.nationalCode.includes(searchQuery)
  );

  const filteredPolicies = policies.filter(
    (policy) =>
      policy.id.includes(policySearchQuery) ||
      policy.customerName.toLowerCase().includes(policySearchQuery.toLowerCase())
  );

  const handleAddCustomer = async () => {
    if (!formData.name.trim() || !formData.nationalCode.trim() || !formData.phone.trim() || !formData.birthDate.trim()) {
      toast.error("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    try {
      const response = await api.post('/admin/customers', {
        full_name: formData.name,
        national_code: formData.nationalCode,
        insurance_code: formData.insuranceCode || formData.phone,
        phone: formData.phone,
        birth_date: formData.birthDate,
        score: formData.score,
        role: editingCustomer?.role || 'customer',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newCustomer = response.data;
      setCustomers([...customers, {
        id: newCustomer.id.toString(),
        name: newCustomer.full_name,
        nationalCode: newCustomer.national_code,
        phone: newCustomer.phone,
        email: '',
        birthDate: formData.birthDate,
        joinDate: new Date().toLocaleDateString("fa-IR"),
        activePolicies: 0,
        status: "فعال",
        score: newCustomer.score,
        password: newCustomer.insurance_code,
      }]);
      setFormData({
        name: "",
        nationalCode: "",
        insuranceCode: "",
        phone: "",
        email: "",
        birthDate: "",
        score: "A",
      });
      setShowCustomerForm(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در افزودن مشتری');
    }
  };

  const handleEditCustomer = async () => {
    if (!editingCustomer) return;
    try {
      const response = await api.put(`/admin/customers/${editingCustomer.id}`, {
        full_name: formData.name,
        national_code: formData.nationalCode,
        insurance_code: formData.insuranceCode || formData.phone,
        phone: formData.phone,
        birth_date: formData.birthDate,
        score: formData.score,
        role: 'customer',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedCustomer = response.data;
      setCustomers(
        customers.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name: updatedCustomer.full_name,
                nationalCode: updatedCustomer.national_code,
                phone: updatedCustomer.phone,
                birthDate: formData.birthDate,
                score: updatedCustomer.score,
                password: updatedCustomer.insurance_code,
              }
            : c
        )
      );
      setFormData({
        name: "",
        nationalCode: "",
        insuranceCode: "",
        phone: "",
        email: "",
        birthDate: "",
        score: "A",
      });
      setShowCustomerForm(false);
      setEditingCustomer(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در بروزرسانی مشتری');
    }
  };

  const handleDeleteCustomer = async () => {
    if (!deleteCustomer) return;
    try {
      await api.delete(`/admin/customers/${deleteCustomer.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(customers.filter((c) => c.id !== deleteCustomer.id));
      setDeleteCustomer(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در حذف مشتری');
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      nationalCode: customer.nationalCode,
      insuranceCode: customer.password || "",
      phone: customer.phone,
      email: customer.email,
      birthDate: customer.birthDate,
      score: customer.score,
    });
    setShowCustomerForm(true);
  };

  const handleCustomerSearch = (query: string) => {
    if (query.length < 2) {
      setCustomerSearchResults([]);
      setShowCustomerDropdown(false);
      return;
    }
    const results = customers.filter(customer =>
      customer.name.toLowerCase().includes(query.toLowerCase()) ||
      customer.nationalCode.includes(query)
    );
    setCustomerSearchResults(results);
    setShowCustomerDropdown(results.length > 0);
  };

  const handleSelectCustomer = (customer: Customer) => {
    setFormDataPolicy({
      ...formDataPolicy,
      customerName: customer.name,
      customerNationalCode: customer.nationalCode,
    });
    setCustomerSearchResults([]);
    setShowCustomerDropdown(false);
  };

  const handleAddPolicy = async () => {
    if (!formDataPolicy.customerName.trim() || !formDataPolicy.customerNationalCode.trim() || !formDataPolicy.type.trim() || !formDataPolicy.vehicle.trim() || !formDataPolicy.startDate.trim() || !formDataPolicy.endDate.trim() || !formDataPolicy.premium.trim()) {
      toast.error("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('customer_id', formDataPolicy.customerNationalCode); // Assuming nationalCode is the id, but wait, customer_id is int, nationalCode is string.
      // Need to find customer by nationalCode to get id.
      const customer = customers.find(c => c.nationalCode === formDataPolicy.customerNationalCode);
      if (!customer) {
        toast.error("مشتری یافت نشد.");
        return;
      }
      if (!customer.id || isNaN(parseInt(customer.id))) {
        toast.error("شناسه مشتری نامعتبر.");
        return;
      }
      formData.append('customer_national_code', formDataPolicy.customerNationalCode);
      formData.append('policy_number', formDataPolicy.policyNumber);
      formData.append('insurance_type', formDataPolicy.type);
      formData.append('details', formDataPolicy.vehicle);
      formData.append('start_date', moment(formDataPolicy.startDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD"));
      formData.append('end_date', moment(formDataPolicy.endDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD"));
      formData.append('premium', formDataPolicy.premium.replace(/,/g, ''));
      formData.append('status', formDataPolicy.status);
      formData.append('payment_type', formDataPolicy.paymentType);
      formData.append('installment_count', formDataPolicy.installmentsCount.toString());
      formData.append('payment_id', formDataPolicy.payId);
      formData.append('payment_link', formDataPolicy.paymentLink);
      if (formDataPolicy.pdfFile) {
        formData.append('pdf', formDataPolicy.pdfFile);
      }

      const response = await api.post('/admin/policies', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const newPolicy = response.data;
      setPolicies([...policies, {
        id: newPolicy.id.toString(),
        customerName: formDataPolicy.customerName,
        customerNationalCode: formDataPolicy.customerNationalCode,
        policyNumber: newPolicy.policy_number,
        type: newPolicy.insurance_type,
        vehicle: newPolicy.details,
        startDate: formDataPolicy.startDate,
        endDate: formDataPolicy.endDate,
        premium: newPolicy.premium.toString(),
        status: newPolicy.status,
        paymentType: newPolicy.payment_type,
        payId: newPolicy.payment_id,
        paymentLink: newPolicy.payment_link,
        installmentsCount: newPolicy.installment_count,
        pdfFile: null,
      }]);
      toast.success("بیمه‌نامه با موفقیت اضافه شد.");
      setFormDataPolicy({
        customerName: "",
        customerNationalCode: "",
        policyNumber: "",
        type: "",
        vehicle: "",
        startDate: "",
        endDate: "",
        premium: "",
        status: "فعال",
        paymentType: "اقساطی",
        payId: "",
        paymentLink: "",
        installmentsCount: 0,
        pdfFile: null,
      });
      setShowAddPolicyForm(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در افزودن بیمه‌نامه');
    }
  };

  const handleEditPolicy = async () => {
    if (!editingPolicy) return;
    try {
      const response = await api.put(`/admin/policies/${editingPolicy.id}`, {
        customer_national_code: formDataPolicy.customerNationalCode,
        policy_number: formDataPolicy.policyNumber,
        insurance_type: formDataPolicy.type,
        details: formDataPolicy.vehicle,
        start_date: moment(formDataPolicy.startDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD"),
        end_date: moment(formDataPolicy.endDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD"),
        premium: formDataPolicy.premium.replace(/,/g, ''),
        status: formDataPolicy.status,
        payment_type: formDataPolicy.paymentType,
        installment_count: formDataPolicy.installmentsCount,
        payment_id: formDataPolicy.payId,
        payment_link: formDataPolicy.paymentLink,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedPolicy = response.data;
      setPolicies(
        policies.map((p) =>
          p.id === editingPolicy.id
            ? {
                ...p,
                customerName: formDataPolicy.customerName,
                customerNationalCode: formDataPolicy.customerNationalCode,
                policyNumber: formDataPolicy.policyNumber,
                type: updatedPolicy.insurance_type,
                vehicle: updatedPolicy.details,
                startDate: formDataPolicy.startDate,
                endDate: formDataPolicy.endDate,
                premium: updatedPolicy.premium.toString(),
                status: updatedPolicy.status,
                paymentType: updatedPolicy.payment_type,
                payId: updatedPolicy.payment_id,
                paymentLink: updatedPolicy.payment_link,
                installmentsCount: updatedPolicy.installment_count,
              }
            : p
        )
      );
      toast.success("بیمه‌نامه با موفقیت بروزرسانی شد.");
      setFormDataPolicy({
        customerName: "",
        customerNationalCode: "",
        policyNumber: "",
        type: "",
        vehicle: "",
        startDate: "",
        endDate: "",
        premium: "",
        status: "فعال",
        paymentType: "اقساطی",
        payId: "",
        paymentLink: "",
        installmentsCount: 0,
        pdfFile: null,
      });
      setShowAddPolicyForm(false);
      setEditingPolicy(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در بروزرسانی بیمه‌نامه');
    }
  };

  const handleDeletePolicy = async () => {
    if (!deletePolicy) return;
    try {
      await api.delete(`/admin/policies/${deletePolicy.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPolicies(policies.filter((p) => p.id !== deletePolicy.id));
      setDeletePolicy(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در حذف بیمه‌نامه');
    }
  };

  const openEditPolicyDialog = (policy: Policy) => {
    setEditingPolicy(policy);
    setFormDataPolicy({
      customerName: policy.customerName,
      customerNationalCode: policy.customerNationalCode || "",
      policyNumber: policy.policyNumber || "",
      type: policy.type,
      vehicle: policy.vehicle,
      startDate: policy.startDate,
      endDate: policy.endDate,
      premium: policy.premium,
      status: policy.status,
      paymentType: policy.paymentType,
      payId: policy.payId || "",
      paymentLink: policy.paymentLink || "",
      installmentsCount: policy.installmentsCount || 0,
      pdfFile: policy.pdfFile || null,
    });
    setShowAddPolicyForm(true);
  };

  const handleAddInstallment = () => {
    if (!formDataInstallment.customerName.trim() || !formDataInstallment.policyType.trim() || !formDataInstallment.amount.trim() || !formDataInstallment.dueDate.trim()) {
      alert("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    const newInstallment: Installment = {
      id: Date.now().toString(),
      ...formDataInstallment,
      status: "معوق",
      daysOverdue: 0,
    };
    setInstallments([...installments, newInstallment]);
    setFormDataInstallment({
      customerName: "",
      customerNationalCode: "",
      policyType: "",
      amount: "",
      dueDate: "",
      payLink: "",
      status: "معوق",
    });
    setShowAddInstallmentForm(false);
  };

  const handleEditInstallment = async () => {
    if (!editingInstallment) return;
    try {
      // Find the original installment to get policy_id and customer_id
      const originalInstallment = installments.find(i => i.id === editingInstallment.id);
      if (!originalInstallment) {
        toast.error('قسط مورد نظر یافت نشد');
        return;
      }

      // Prepare the update data according to backend entity structure
      const updateData = {
        amount: parseFloat(formDataInstallment.amount.replace(/,/g, '')),
        due_date: moment(formDataInstallment.dueDate, "jYYYY/jMM/jDD").format("YYYY-MM-DD"),
        status: formDataInstallment.status,
        pay_link: formDataInstallment.payLink || null,
      };

      await api.put(`/installments/${editingInstallment.id}`, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

        // Update local state with the response
        setInstallments(
          installments.map((i) =>
            i.id === editingInstallment.id
              ? {
                  ...i,
                  amount: formDataInstallment.amount,
                  dueDate: formDataInstallment.dueDate,
                  payLink: formDataInstallment.payLink,
                  status: formDataInstallment.status,
                  // Keep the original customer and policy info
                  customerName: i.customerName,
                  customerNationalCode: i.customerNationalCode,
                  policyType: i.policyType,
                }
              : i
          )
        );

        toast.success("قسط با موفقیت بروزرسانی شد.");
        setFormDataInstallment({
          customerName: "",
          customerNationalCode: "",
          policyType: "",
          amount: "",
          dueDate: "",
          payLink: "",
          status: "معوق",
        });
        setShowAddInstallmentForm(false);
        setEditingInstallment(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در بروزرسانی قسط');
    }
  };

  const handleDeleteInstallment = () => {
    if (!deleteInstallment) return;
    setInstallments(installments.filter((i) => i.id !== deleteInstallment.id));
    setDeleteInstallment(null);
  };

  const openEditInstallmentDialog = (installment: Installment) => {
    setEditingInstallment(installment);
    setFormDataInstallment({
      customerName: installment.customerName,
      customerNationalCode: installment.customerNationalCode || "",
      policyType: installment.policyType,
      amount: installment.amount,
      dueDate: installment.dueDate,
      payLink: installment.payLink || "",
      status: installment.status,
    });
    setShowAddInstallmentForm(true);
  };

  const filteredInstallments = installments.filter(
    (i) =>
      i.customerName
        .toLowerCase()
        .includes(installmentSearchQuery.toLowerCase()) ||
      i.policyType.toLowerCase().includes(installmentSearchQuery.toLowerCase())
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedInstallments = [...filteredInstallments].sort((a, b) => {
    if (!sortField) return 0;
    const aVal = a[sortField as keyof Installment] as string;
    const bVal = b[sortField as keyof Installment] as string;
    if (sortDirection === "asc") {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      (blog.author && blog.author.toLowerCase().includes(blogSearchQuery.toLowerCase())) ||
      blog.category.toLowerCase().includes(blogSearchQuery.toLowerCase())
  );

  const handleAddBlog = () => {
    if (!formDataBlog.title.trim() || !formDataBlog.excerpt.trim() || !formDataBlog.content.trim() || !formDataBlog.category.trim()) {
      alert("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    addBlog({
      ...formDataBlog,
      date: formDataBlog.date || new Date().toLocaleDateString("fa-IR"),
    });
    setFormDataBlog({
      title: "",
      excerpt: "",
      content: "",
      date: "",
      imageUrl: "",
      category: "",
    });
    setShowAddBlogForm(false);
  };

  const handleEditBlog = () => {
    if (!editingBlog) return;
    updateBlog(editingBlog.id, formDataBlog);
    setFormDataBlog({
      title: "",
      excerpt: "",
      content: "",
      date: "",
      imageUrl: "",
      category: "",
    });
    setShowAddBlogForm(false);
    setEditingBlog(null);
  };

  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const handleDeleteBlog = () => {
    if (!deleteBlogId) return;
    deleteBlog(deleteBlogId);
    setDeleteBlogId(null);
  };

  const openEditBlogDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormDataBlog({
      title: blog.title,
      excerpt: blog.excerpt,
      content: blog.content,
      date: blog.date,
      imageUrl: blog.imageUrl || "",
      category: blog.category,
    });
    setShowAddBlogForm(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "فعال":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            فعال
          </Badge>
        );
      case "غیرفعال":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
            غیرفعال
          </Badge>
        );
      case "نزدیک انقضا":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            نزدیک انقضا
          </Badge>
        );
      case "معوق":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            معوق
          </Badge>
        );
      case "پرداخت شده":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            پرداخت شده
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-lg">پنل مدیریت</h1>
                <p className="text-sm text-gray-600">
                  سامانه مدیریت بیمه البرز
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => { localStorage.removeItem('token'); onLogout(); }}>
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl mb-2">داشبورد مدیریت</h2>
          <p className="text-gray-600">مدیریت مشتریان، بیمه‌نامه‌ها و اقساط</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">کل مشتریان</p>
                  <p className="text-3xl">{stats.customersCount - 1}</p>
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
                  <p className="text-3xl">{stats.policiesCount}</p>
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
                  <p className="text-3xl text-red-600">{stats.overdueInstallmentsCount}</p>
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
                  <p className="text-3xl text-yellow-600">{stats.nearExpiryPoliciesCount}</p>
                  <p className="text-sm text-yellow-600 mt-1">در ۳۰ روز آینده</p>
                </div>
                <Calendar className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="relative grid w-full grid-cols-4 bg-gray-100 p-1 rounded-lg">
            <motion.div
              className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm"
              style={{ width: "calc(25% - 4px)" }}
              animate={{ left: `calc(${tabIndex} * 25% + 2px)` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <TabsTrigger
              value="customers"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              مشتریان
            </TabsTrigger>
            <TabsTrigger
              value="policies"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              بیمه‌نامه‌ها
            </TabsTrigger>
            <TabsTrigger
              value="installments"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              اقساط
            </TabsTrigger>
            <TabsTrigger
              value="blogs"
              className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              {" "}
              وبلاگ
            </TabsTrigger>
          </TabsList>

          {/* Customers Management */}
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>مدیریت مشتریان</CardTitle>
                  </div>
                  <Button
                    onClick={() => {
                      setEditingCustomer(null);
                      setFormData({
                        name: "",
                        nationalCode: "",
                        insuranceCode: "",
                        phone: "",
                        email: "",
                        birthDate: "",
                        score: "A",
                      });
                      setShowCustomerForm((prev) => !prev);
                    }}
                    variant={showCustomerForm ? "outline" : "default"}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    افزودن مشتری
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <AnimatePresence>
                  {showCustomerForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-4 bg-white rounded-lg shadow border overflow-hidden"
                      dir="rtl"
                    >
                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          نام و نام خانوادگی
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="nationalCode" className="text-right">
                          کد ملی
                        </Label>
                        <Input
                          id="nationalCode"
                          name="nationalCode"
                          value={formData.nationalCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              nationalCode: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="insuranceCode"
                          className="text-right"
                        >
                          کد بیمه گذار
                        </Label>
                        <Input
                          id="insuranceCode"
                          name="insuranceCode"
                          value={formData.insuranceCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              insuranceCode: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="phone" className="text-right">
                          شماره تماس
                        </Label>
                        <Input
                          id="phone"
                          name="phone"
                          autoComplete="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="birthDate" className="text-right">
                          تاریخ تولد
                        </Label>
                        <div className="col-span-3">
                          <ClientOnlyDatePicker
                            id="birthDate"
                            value={formData.birthDate}
                            onChange={(date: string) => {
                              setFormData({ ...formData, birthDate: date });
                            }}
                            placeholder="انتخاب تاریخ تولد"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="score" className="text-right">
                          امتیاز مشتری
                        </Label>
                        <Select
                          name="score"
                          value={formData.score}
                          onValueChange={(value: 'A' | 'B' | 'C' | 'D') =>
                            setFormData({ ...formData, score: value })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                    </div>
                    <div className="flex gap-2 mt-4 justify-end">
                      <Button onClick={editingCustomer ? handleEditCustomer : handleAddCustomer}>
                        {editingCustomer ? "ذخیره تغییرات" : "ثبت مشتری"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFormData({
                            name: "",
                            nationalCode: "",
                            insuranceCode: "",
                            phone: "",
                            email: "",
                            birthDate: "",
                            score: "A",
                          });
                          setShowCustomerForm(false);
                        }}
                      >
                        لغو
                      </Button>
                    </div>
                  </motion.div>
                )}
                </AnimatePresence>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="جستجو در مشتریان..."
                      dir="rtl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left pl-8">عملیات</TableHead>
                      <TableHead className="text-right">وضعیت</TableHead>
                      <TableHead className="text-right">امتیاز</TableHead>
                      <TableHead className="text-right">بیمه‌نامه‌های فعال</TableHead>
                      
                      <TableHead className="text-right">شماره تماس</TableHead>
                      <TableHead className="text-right">کد ملی</TableHead>
                      <TableHead className="text-right">نام و نام خانوادگی</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditDialog(customer)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => setDeleteCustomer(customer)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف مشتری</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    آیا مطمئن هستید که می‌خواهید این مشتری را
                                    حذف کنید؟ این عمل قابل بازگشت نیست.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>لغو</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteCustomer}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(customer.status)}</TableCell>
                        <TableCell>{customer.score}</TableCell>
                        <TableCell>{customer.activePolicies}</TableCell>

                        <TableCell>{customer.phone}</TableCell>
                        <TableCell>{customer.nationalCode}</TableCell>
                        <TableCell>{customer.name}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

            </Card>
          </TabsContent>

          {/* Policies Management */}
          <TabsContent value="policies">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>مدیریت بیمه‌نامه‌ها</CardTitle>
                  </div>
                  <Button
                    onClick={() => setShowAddPolicyForm((prev) => !prev)}
                    variant={showAddPolicyForm ? "outline" : "default"}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    صدور بیمه‌نامه
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Inline Add/Edit Policy Form */}
                <AnimatePresence>
                  {showAddPolicyForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-4 bg-white rounded-lg shadow border overflow-hidden"
                      dir="rtl"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        {editingPolicy ? "ویرایش بیمه‌نامه" : "صدور بیمه‌نامه"}
                      </h3>
                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-4 items-center gap-4 relative">
                        <Label
                          htmlFor="policy-customerName"
                          className="text-right"
                        >
                          نام مشتری
                        </Label>
                        <div className="col-span-3 relative">
                          <Input
                            id="policy-customerName"
                            name="customerName"
                            autoComplete="name"
                            value={formDataPolicy.customerName}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormDataPolicy({
                                ...formDataPolicy,
                                customerName: value,
                              });
                              handleCustomerSearch(value);
                            }}
                            className="w-full"
                            placeholder="جستجو نام مشتری..."
                          />
                          {showCustomerDropdown && customerSearchResults.length > 0 && (
                            <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto mt-1">
                              {customerSearchResults.map((customer) => (
                                <div
                                  key={customer.id}
                                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() => handleSelectCustomer(customer)}
                                >
                                  <div className="font-medium">{customer.name}</div>
                                  <div className="text-sm text-gray-500">{customer.nationalCode}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label
                           htmlFor="policy-customerNationalCode"
                           className="text-right"
                         >
                           کد ملی مشتری
                         </Label>
                         <Input
                           id="policy-customerNationalCode"
                           name="customerNationalCode"
                           autoComplete="off"
                           value={formDataPolicy.customerNationalCode}
                           onChange={(e) =>
                             setFormDataPolicy({
                               ...formDataPolicy,
                               customerNationalCode: e.target.value,
                             })
                           }
                           className="col-span-3"
                         />
                       </div>
                       <div className="grid grid-cols-4 items-center gap-4">
                         <Label
                           htmlFor="policy-policyNumber"
                           className="text-right"
                         >
                           شماره بیمه‌نامه
                         </Label>
                         <Input
                           id="policy-policyNumber"
                           name="policyNumber"
                           value={formDataPolicy.policyNumber}
                           onChange={(e) =>
                             setFormDataPolicy({
                               ...formDataPolicy,
                               policyNumber: e.target.value,
                             })
                           }
                           className="col-span-3"
                         />
                       </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-type" className="text-right">
                          نوع بیمه
                        </Label>
                        <Select
                          name="policy-type"
                          value={formDataPolicy.type}
                          onValueChange={(value: string) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              type: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ثالث">ثالث</SelectItem>
                            <SelectItem value="بدنه">بدنه</SelectItem>
                            <SelectItem value="آتش سوزی">آتش سوزی</SelectItem>
                            <SelectItem value="حوادث">حوادث</SelectItem>
                            <SelectItem value="زندگی">زندگی</SelectItem>
                            <SelectItem value="مسئولیت">مسئولیت</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-vehicle" className="text-right">
                          جزییات بیمه
                        </Label>
                        <Input
                          id="policy-vehicle"
                          name="policy-vehicle"
                          value={formDataPolicy.vehicle}
                          onChange={(e) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              vehicle: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="policy-startDate"
                          className="text-right"
                        >
                          تاریخ شروع
                        </Label>
                        <div className="col-span-3">
                          <ClientOnlyDatePicker
                            id="policy-startDate"
                            value={formDataPolicy.startDate}
                            onChange={(date: string) => {
                              setFormDataPolicy({
                                ...formDataPolicy,
                                startDate: date,
                              });
                            }}
                            placeholder="انتخاب تاریخ شروع"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-endDate" className="text-right">
                          تاریخ انقضا
                        </Label>
                        <div className="col-span-3">
                          <ClientOnlyDatePicker
                            id="policy-endDate"
                            value={formDataPolicy.endDate}
                            onChange={(date: string) => {
                              setFormDataPolicy({
                                ...formDataPolicy,
                                endDate: date,
                              });
                            }}
                            placeholder="انتخاب تاریخ انقضا"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-premium" className="text-right">
                          حق بیمه (ریال)
                        </Label>
                        <PriceInput
                          value={formDataPolicy.premium}
                          onChange={(value) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              premium: value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-status" className="text-right">
                          وضعیت بیمه‌نامه
                        </Label>
                        <Select
                          name="policy-status"
                          value={formDataPolicy.status}
                          onValueChange={(value: string) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="فعال">فعال</SelectItem>
                            <SelectItem value="نزدیک انقضا">نزدیک انقضا</SelectItem>
                            <SelectItem value="منقضی">منقضی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-paymentType" className="text-right">
                          نوع پرداخت
                        </Label>
                        <Select
                          name="paymentType"
                          value={formDataPolicy.paymentType}
                          onValueChange={(value: string) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              paymentType: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="نقدی">نقدی</SelectItem>
                            <SelectItem value="اقساطی">اقساطی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-installmentsCount" className="text-right">
                          تعداد اقساط
                        </Label>
                        <Input
                          id="policy-installmentsCount"
                          name="installmentsCount"
                          type="number"
                          min="1"
                          max="12"
                          value={formDataPolicy.installmentsCount || ""}
                          onChange={(e) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              installmentsCount: parseInt(e.target.value) || 0,
                            })
                          }
                          disabled={formDataPolicy.paymentType === "نقدی"}
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-payId" className="text-right">
                          شناسه پرداخت
                        </Label>
                        <Input
                          id="policy-payId"
                          name="payId"
                          value={formDataPolicy.payId}
                          onChange={(e) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              payId: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-payment-link" className="text-right">
                          لینک پرداخت
                        </Label>
                        <Input
                          id="policy-payment-link"
                          name="paymentLink"
                          value={formDataPolicy.paymentLink}
                          onChange={(e) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              paymentLink: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="policy-pdf" className="text-right">
                          فایل PDF
                        </Label>
                        <Input
                          id="policy-pdf"
                          name="policy-pdf"
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setFormDataPolicy({
                              ...formDataPolicy,
                              pdfFile: e.target.files
                                ? e.target.files[0]
                                : null,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <Button onClick={editingPolicy ? handleEditPolicy : handleAddPolicy}>
                          {editingPolicy ? "ذخیره تغییرات" : "ثبت بیمه‌نامه"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingPolicy(null);
                            setFormDataPolicy({
                              customerName: "",
                              customerNationalCode: "",
                              policyNumber: "",
                              type: "",
                              vehicle: "",
                              startDate: "",
                              endDate: "",
                              premium: "",
                              status: "فعال",
                              paymentType: "اقساطی",
                              payId: "",
                              paymentLink: "",
                              installmentsCount: 0,
                              pdfFile: null,
                            });
                            setShowAddPolicyForm(false);
                          }}
                        >
                          لغو
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="جستجو بر اساس شماره بیمه‌نامه یا نام مشتری..."
                      dir="rtl"
                      value={policySearchQuery}
                      onChange={(e) => setPolicySearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                <Table>
                   <TableHeader>
                     <TableRow>
                       <TableHead className="text-left pl-8">عملیات</TableHead>
                       <TableHead className="text-right">وضعیت</TableHead>
                       <TableHead className="text-right">نوع پرداخت</TableHead>
                       <TableHead className="text-right">شناسه پرداخت</TableHead>
                       <TableHead className="text-right">تعداد اقساط</TableHead>
                       <TableHead className="text-right">حق بیمه</TableHead>
                       <TableHead className="text-right">تاریخ انقضا</TableHead>
                       <TableHead className="text-right">تاریخ شروع</TableHead>
                       <TableHead className="text-right">جزییات بیمه</TableHead>
                       <TableHead className="text-right">نوع بیمه</TableHead>
                       <TableHead className="text-right">نام مشتری</TableHead>
                       <TableHead className="text-right">شماره بیمه‌نامه</TableHead>
                     </TableRow>
                   </TableHeader>
                  <TableBody>
                    {filteredPolicies.length > 0 ? (
                      filteredPolicies.map((policy) => (
                        <TableRow key={policy.id}>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditPolicyDialog(policy)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => setDeletePolicy(policy)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      حذف بیمه‌نامه
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      آیا مطمئن هستید که می‌خواهید این بیمه‌نامه
                                      را حذف کنید؟ این عمل قابل بازگشت نیست.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>لغو</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeletePolicy}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(policy.status)}</TableCell>
                          <TableCell>{policy.paymentType}</TableCell>
                          <TableCell>{policy.payId}</TableCell>
                          <TableCell>{policy.installmentsCount || 0}</TableCell>
                          <TableCell>{formatPrice(policy.premium)}</TableCell>
                          <TableCell>{policy.endDate}</TableCell>
                          <TableCell>{policy.startDate}</TableCell>
                          <TableCell>{policy.vehicle}</TableCell>
                          <TableCell>{policy.type}</TableCell>
                          <TableCell>{policy.customerName}</TableCell>
                          <TableCell>{policy.policyNumber}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center h-24">
                          هیچ بیمه‌نامه‌ای یافت نشد.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>

              {/* Edit Policy Dialog removed */}
            </Card>
          </TabsContent>

          {/* Installments Management */}
          <TabsContent value="installments">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>مدیریت اقساط</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {/* Inline Add/Edit Installment Form */}
                <AnimatePresence>
                  {showAddInstallmentForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-4 bg-white rounded-lg shadow border overflow-hidden"
                      dir="rtl"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        {editingInstallment ? "ویرایش قسط" : "افزودن قسط"}
                      </h3>
                    <div className="grid gap-4 py-2">
                      {/* Show customer and policy info as read-only when editing */}
                      {editingInstallment && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">نام مشتری</Label>
                            <div className="col-span-3 p-2 bg-gray-50 rounded">
                              {formDataInstallment.customerName}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">کد ملی مشتری</Label>
                            <div className="col-span-3 p-2 bg-gray-50 rounded">
                              {formDataInstallment.customerNationalCode}
                            </div>
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label className="text-right">نوع بیمه</Label>
                            <div className="col-span-3 p-2 bg-gray-50 rounded">
                              {formDataInstallment.policyType}
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Show input fields for new installment */}
                      {!editingInstallment && (
                        <>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="installment-customerName"
                              className="text-right"
                            >
                              نام مشتری
                            </Label>
                            <Input
                              id="installment-customerName"
                              name="customerName"
                              autoComplete="name"
                              value={formDataInstallment.customerName}
                              onChange={(e) =>
                                setFormDataInstallment({
                                  ...formDataInstallment,
                                  customerName: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="installment-customerNationalCode"
                              className="text-right"
                            >
                              کد ملی مشتری
                            </Label>
                            <Input
                              id="installment-customerNationalCode"
                              name="customerNationalCode"
                              autoComplete="off"
                              value={formDataInstallment.customerNationalCode}
                              onChange={(e) =>
                                setFormDataInstallment({
                                  ...formDataInstallment,
                                  customerNationalCode: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label
                              htmlFor="installment-policyType"
                              className="text-right"
                            >
                              نوع بیمه
                            </Label>
                            <Input
                              id="installment-policyType"
                              name="policyType"
                              value={formDataInstallment.policyType}
                              onChange={(e) =>
                                setFormDataInstallment({
                                  ...formDataInstallment,
                                  policyType: e.target.value,
                                })
                              }
                              className="col-span-3"
                            />
                          </div>
                        </>
                      )}
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="installment-amount"
                          className="text-right"
                        >
                          مبلغ قسط (ریال)
                        </Label>
                        <PriceInput
                          value={formDataInstallment.amount}
                          onChange={(value) =>
                            setFormDataInstallment({
                              ...formDataInstallment,
                              amount: value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="installment-dueDate"
                          className="text-right"
                        >
                          سررسید
                        </Label>
                        <div className="col-span-3">
                          <ClientOnlyDatePicker
                            id="installment-dueDate"
                            value={formDataInstallment.dueDate}
                            onChange={(date: string) => {
                              setFormDataInstallment({
                                ...formDataInstallment,
                                dueDate: date,
                              });
                            }}
                            placeholder="انتخاب سررسید"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="installment-status"
                          className="text-right"
                        >
                          وضعیت
                        </Label>
                        <Select
                          name="status"
                          value={formDataInstallment.status}
                          onValueChange={(value: string) =>
                            setFormDataInstallment({
                              ...formDataInstallment,
                              status: value,
                            })
                          }
                        >
                          <SelectTrigger className="col-span-3">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="معوق">معوق</SelectItem>
                            <SelectItem value="آینده">آینده</SelectItem>
                            <SelectItem value="پرداخت شده">
                              پرداخت شده
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="installment-payLink"
                          className="text-right"
                        >
                          لینک پرداخت
                        </Label>
                        <Input
                          id="installment-payLink"
                          name="payLink"
                          value={formDataInstallment.payLink}
                          onChange={(e) =>
                            setFormDataInstallment({
                              ...formDataInstallment,
                              payLink: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <Button onClick={editingInstallment ? handleEditInstallment : handleAddInstallment}>
                          {editingInstallment ? "ذخیره تغییرات" : "ثبت قسط"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingInstallment(null);
                            setFormDataInstallment({
                              customerName: "",
                              customerNationalCode: "",
                              policyType: "",
                              amount: "",
                              dueDate: "",
                              payLink: "",
                              status: "معوق",
                            });
                            setShowAddInstallmentForm(false);
                          }}
                        >
                          لغو
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="جستجو بر اساس نام مشتری یا نوع بیمه..."
                      dir="rtl"
                      value={installmentSearchQuery}
                      onChange={(e) =>
                        setInstallmentSearchQuery(e.target.value)
                      }
                      className="pr-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-left pl-8">عملیات</TableHead>
                      <TableHead
                        onClick={() => handleSort("status")}
                        className="cursor-pointer hover:bg-gray-50 text-right"
                      >
                        وضعیت
                      </TableHead>
                      <TableHead className="text-right">تعداد روز تاخیر</TableHead>
                      <TableHead
                        onClick={() => handleSort("dueDate")}
                        className="cursor-pointer hover:bg-gray-50 text-right"
                      >
                        سررسید
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("amount")}
                        className="cursor-pointer hover:bg-gray-50 text-right"
                      >
                        مبلغ قسط
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("policyType")}
                        className="cursor-pointer hover:bg-gray-50 text-right"
                      >
                        نوع بیمه
                      </TableHead>
                      <TableHead
                        onClick={() => handleSort("customerName")}
                        className="cursor-pointer hover:bg-gray-50 text-right"
                      >
                        نام مشتری
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedInstallments.length > 0 ? (
                      sortedInstallments.map((installment) => (
                        <TableRow key={installment.id}>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  openEditInstallmentDialog(installment)
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() =>
                                      setDeleteInstallment(installment)
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>حذف قسط</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      آیا مطمئن هستید که می‌خواهید این قسط را حذف
                                      کنید؟ این عمل قابل بازگشت نیست.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>لغو</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleDeleteInstallment}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      حذف
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(installment.status)}
                          </TableCell>
                          <TableCell>
                            {installment.status === 'پرداخت شده' ? (
                              "-"
                            ) : installment.daysOverdue > 0 ? (
                              <span className="text-red-600">
                                {installment.daysOverdue} روز
                              </span>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{installment.dueDate}</TableCell>
                          <TableCell>{formatPrice(installment.amount)}</TableCell>
                          <TableCell>{installment.policyType}</TableCell>
                          <TableCell>{installment.customerName}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center h-24">
                          هیچ قسطی یافت نشد.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>

              {/* Edit Installment Dialog removed */}
            </Card>
          </TabsContent>

          {/* Blogs Management */}
          <TabsContent value="blogs">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>مدیریت وبلاگ</CardTitle>
                  </div>
                  <Button
                    onClick={() => setShowAddBlogForm((prev) => !prev)}
                    variant={showAddBlogForm ? "outline" : "default"}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    افزودن مقاله
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Inline Add/Edit Blog Form */}
                <AnimatePresence>
                  {showAddBlogForm && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mb-6 p-4 bg-white rounded-lg shadow border overflow-hidden"
                      dir="rtl"
                    >
                      <h3 className="text-lg font-semibold mb-4">
                        {editingBlog ? "ویرایش مقاله" : "افزودن مقاله"}
                      </h3>
                    <div className="grid gap-4 py-2">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blog-title" className="text-right">
                          عنوان
                        </Label>
                        <Input
                          id="blog-title"
                          name="blog-title"
                          value={formDataBlog.title}
                          onChange={(e) =>
                            setFormDataBlog({
                              ...formDataBlog,
                              title: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blog-excerpt" className="text-right">
                          خلاصه
                        </Label>
                        <Input
                          id="blog-excerpt"
                          name="blog-excerpt"
                          value={formDataBlog.excerpt}
                          onChange={(e) =>
                            setFormDataBlog({
                              ...formDataBlog,
                              excerpt: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blog-content" className="text-right">
                          محتوا
                        </Label>
                        <textarea
                          id="blog-content"
                          name="blog-content"
                          value={formDataBlog.content}
                          onChange={(e) =>
                            setFormDataBlog({
                              ...formDataBlog,
                              content: e.target.value,
                            })
                          }
                          className="col-span-3 border rounded-md p-2 min-h-24"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blog-date" className="text-right">
                          تاریخ
                        </Label>
                        <div className="col-span-3">
                          <ClientOnlyDatePicker
                            id="blog-date"
                            value={formDataBlog.date}
                            onChange={(date: string) => {
                              setFormDataBlog({ ...formDataBlog, date });
                            }}
                            placeholder="انتخاب تاریخ"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blog-image" className="text-right">
                          تصویر
                        </Label>
                        <Input
                          id="blog-image"
                          name="blog-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setFormDataBlog({
                              ...formDataBlog,
                              imageUrl: e.target.files
                                ? e.target.files[0].name
                                : "",
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="blog-category" className="text-right">
                          دسته‌بندی
                        </Label>
                        <Input
                          id="blog-category"
                          name="blog-category"
                          value={formDataBlog.category}
                          onChange={(e) =>
                            setFormDataBlog({
                              ...formDataBlog,
                              category: e.target.value,
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                      <div className="flex gap-2 mt-4 justify-end">
                        <Button onClick={editingBlog ? handleEditBlog : handleAddBlog}>
                          {editingBlog ? "ذخیره تغییرات" : "ثبت مقاله"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditingBlog(null);
                            setFormDataBlog({
                              title: "",
                              excerpt: "",
                              content: "",
                              date: "",
                              imageUrl: "",
                              category: "",
                            });
                            setShowAddBlogForm(false);
                          }}
                        >
                          لغو
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="جستجو در مقالات..."
                      dir="rtl"
                      value={blogSearchQuery}
                      onChange={(e) => setBlogSearchQuery(e.target.value)}
                      className="pr-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="pl-8">عملیات</TableHead>
                      <TableHead className="text-right">تاریخ</TableHead>
                      <TableHead className="text-right">دسته‌بندی</TableHead>
                      <TableHead className="text-right">عنوان</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBlogs.map((blog) => (
                      <TableRow key={blog.id}>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditBlogDialog(blog)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => setDeleteBlogId(blog.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>حذف مقاله</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    آیا مطمئن هستید که می‌خواهید این مقاله را
                                    حذف کنید؟ این عمل قابل بازگشت نیست.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>لغو</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleDeleteBlog}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                        <TableCell>{blog.date}</TableCell>
                        <TableCell>{blog.category}</TableCell>
                        <TableCell className="max-w-xs truncate">
                          {blog.title}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>

              {/* Edit Blog Dialog removed */}
            </Card>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}

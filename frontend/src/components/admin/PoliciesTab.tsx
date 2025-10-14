import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import api from '../../utils/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ClientOnlyDatePicker } from "../ui/ClientOnlyDatePicker";
import { PriceInput } from "../PriceInput";
import type { Policy, Customer } from "../../types/admin";
import { toPersianDigits, formatPrice } from "../../utils/adminUtils";
import { Badge } from "../ui/badge";
import moment from "moment-jalaali";
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
} from "../ui/alert-dialog";

interface PoliciesTabProps {
  policies: Policy[];
  setPolicies: React.Dispatch<React.SetStateAction<Policy[]>>;
  customers: Customer[];
  loadingPolicies: boolean;
  token: string;
  onLogout: () => void;
}

export function PoliciesTab({ policies, setPolicies, customers, loadingPolicies, token }: PoliciesTabProps) {
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
    installmentType: "تمام قسط",
    firstInstallmentAmount: "",
    pdfFile: null as File | null,
  });
  const [deletePolicy, setDeletePolicy] = useState<Policy | null>(null);
  const [showAddPolicyForm, setShowAddPolicyForm] = useState(false);
  const [customerSearchResults, setCustomerSearchResults] = useState<Customer[]>([]);
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const [policySearchQuery, setPolicySearchQuery] = useState("");
  const [currentPagePolicies, setCurrentPagePolicies] = useState(1);
  const itemsPerPagePolicies = 10;
  const [policySortField, setPolicySortField] = useState<string>("");
  const [policySortState, setPolicySortState] = useState<Record<string, number>>({});

  const getPolicySortValue = (field: string, item: Policy) => {
    if (field === 'startDate') {
      return moment(item.startDate, "jYYYY/jMM/jDD").valueOf();
    } else if (field === 'policyNumber') {
      return parseInt(item.policyNumber || '0', 10);
    } else {
      return item[field as keyof Policy] as string;
    }
  };

  const filteredPolicies = policies.filter(
    (policy) =>
      (policy.policyNumber && policy.policyNumber.includes(policySearchQuery)) ||
      policy.customerName.toLowerCase().includes(policySearchQuery.toLowerCase())
  );

  const sortedPolicies = [...filteredPolicies].sort((a, b) => {
    if (!policySortField) return 0;
    const aVal = getPolicySortValue(policySortField, a);
    const bVal = getPolicySortValue(policySortField, b);
    let cmp = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
    }
    const mode = policySortState[policySortField] || 0;
    return mode === 0 ? cmp : -cmp; // 0: asc, 1: desc
  });

  const totalPagesPolicies = Math.ceil(sortedPolicies.length / itemsPerPagePolicies);
  const startIndexPolicies = (currentPagePolicies - 1) * itemsPerPagePolicies;
  const paginatedPolicies = sortedPolicies.slice(startIndexPolicies, startIndexPolicies + itemsPerPagePolicies);

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
    if (!formDataPolicy.customerName.trim() || !formDataPolicy.customerNationalCode.trim() || !formDataPolicy.type.trim() || !formDataPolicy.startDate.trim() || !formDataPolicy.premium.trim() || !formDataPolicy.status.trim() || !formDataPolicy.paymentType.trim() || (formDataPolicy.paymentType === 'اقساطی' && (!formDataPolicy.installmentsCount || formDataPolicy.installmentsCount <= 0)) || (formDataPolicy.paymentType === 'اقساطی' && !formDataPolicy.installmentType.trim()) || (formDataPolicy.installmentType === 'پیش پرداخت' && (!formDataPolicy.firstInstallmentAmount || formDataPolicy.firstInstallmentAmount.trim() === ''))) {
      toast.error("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    try {
      const formData = new FormData();
      // Find customer by nationalCode to get id.
      const customer = customers.find(c => c.nationalCode === formDataPolicy.customerNationalCode);
      if (!customer) {
        toast.error("مشتری یافت نشد.");
        return;
      }
      if (!customer.id || isNaN(parseInt(customer.id))) {
        toast.error("شناسه مشتری نامعتبر.");
        return;
      }
      formData.append('customer_id', customer.id);
      formData.append('customer_national_code', formDataPolicy.customerNationalCode);
      formData.append('policy_number', formDataPolicy.policyNumber);
      formData.append('insurance_type', formDataPolicy.type);
      formData.append('details', formDataPolicy.vehicle);
      formData.append('start_date', formDataPolicy.startDate);
      if (formDataPolicy.endDate && formDataPolicy.endDate.trim() !== '') {
        formData.append('end_date', formDataPolicy.endDate);
      }
      formData.append('premium', formDataPolicy.premium.replace(/,/g, ''));
      formData.append('status', formDataPolicy.status);
      formData.append('payment_type', formDataPolicy.paymentType);
      formData.append('installment_count', formDataPolicy.installmentsCount.toString());
      formData.append('installment_type', formDataPolicy.installmentType);
      if (formDataPolicy.firstInstallmentAmount && formDataPolicy.firstInstallmentAmount.trim() !== '') {
        formData.append('first_installment_amount', formDataPolicy.firstInstallmentAmount.replace(/,/g, ''));
      }
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
        endDate: newPolicy.end_date,
        premium: newPolicy.premium.toString(),
        status: newPolicy.status,
        paymentType: newPolicy.payment_type,
        payId: newPolicy.payment_id,
        paymentLink: newPolicy.payment_link,
        installmentsCount: newPolicy.installment_count,
        installment_type: newPolicy.installment_type,
        first_installment_amount: newPolicy.first_installment_amount,
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
        installmentType: "تمام قسط",
        firstInstallmentAmount: "",
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
        start_date: formDataPolicy.startDate, // Already in Jalaali format
        premium: formDataPolicy.premium.replace(/,/g, ''),
        status: formDataPolicy.status,
        payment_type: formDataPolicy.paymentType,
        installment_count: formDataPolicy.installmentsCount,
        installment_type: formDataPolicy.installmentType,
        first_installment_amount: formDataPolicy.firstInstallmentAmount && formDataPolicy.firstInstallmentAmount.trim() !== '' ? formDataPolicy.firstInstallmentAmount.replace(/,/g, '') : null,
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
                endDate: updatedPolicy.end_date,
                premium: updatedPolicy.premium.toString(),
                status: updatedPolicy.status,
                paymentType: updatedPolicy.payment_type,
                payId: updatedPolicy.payment_id,
                paymentLink: updatedPolicy.payment_link,
                installmentsCount: updatedPolicy.installment_count,
                installment_type: updatedPolicy.installment_type,
                first_installment_amount: updatedPolicy.first_installment_amount,
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
        installmentType: "تمام قسط",
        firstInstallmentAmount: "",
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
      installmentType: policy.installment_type || "تمام قسط",
      firstInstallmentAmount: policy.first_installment_amount || "",
      pdfFile: policy.pdfFile || null,
    });
    setShowAddPolicyForm(true);
  };

  const handlePolicySort = (field: string) => {
    setPolicySortState(prev => {
      const newState = { ...prev };
      if (policySortField === field) {
        newState[field] = (newState[field] || 0) + 1;
        if (newState[field] > 1) newState[field] = 0;
      } else {
        setPolicySortField(field);
        newState[field] = 0;
      }
      return newState;
    });
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
    <TabsContent value="policies">
      <Card className="shadow-green-100 shadow-xl ring-2 ring-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {loadingPolicies ? <Skeleton className="h-6 w-40" /> : <CardTitle>مدیریت بیمه‌نامه‌ها</CardTitle>}
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
                      نام مشتری <span className="text-red-500">*</span>
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
                      کد ملی مشتری <span className="text-red-500">*</span>
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
                      نوع بیمه <span className="text-red-500">*</span>
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
                      تاریخ شروع <span className="text-red-500">*</span>
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
                        placeholder="انتخاب تاریخ انقضا (اختیاری)"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="policy-premium" className="text-right">
                      حق بیمه (ریال) <span className="text-red-500">*</span>
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
                      وضعیت بیمه‌نامه <span className="text-red-500">*</span>
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
                      نوع پرداخت <span className="text-red-500">*</span>
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
                      تعداد اقساط <span className="text-red-500">*</span>
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
                    <Label htmlFor="policy-installmentType" className="text-right">
                      نوع قسط <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      name="installmentType"
                      value={formDataPolicy.installmentType}
                      onValueChange={(value: string) =>
                        setFormDataPolicy({
                          ...formDataPolicy,
                          installmentType: value,
                        })
                      }
                      disabled={formDataPolicy.paymentType === "نقدی"}
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="تمام قسط">تمام قسط</SelectItem>
                        <SelectItem value="پیش پرداخت">پیش پرداخت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formDataPolicy.installmentType === "پیش پرداخت" && formDataPolicy.paymentType === "اقساطی" && (
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="policy-firstInstallmentAmount" className="text-right">
                        مبلغ پیش پرداخت (ریال) <span className="text-red-500">*</span>
                      </Label>
                      <PriceInput
                        value={formDataPolicy.firstInstallmentAmount}
                        onChange={(value) =>
                          setFormDataPolicy({
                            ...formDataPolicy,
                            firstInstallmentAmount: value,
                          })
                        }
                        className="col-span-3"
                      />
                    </div>
                  )}
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
                        installmentType: "تمام قسط",
                        firstInstallmentAmount: "",
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
                <TableHead onClick={() => handlePolicySort("startDate")} className="cursor-pointer hover:bg-gray-50 text-right">تاریخ شروع</TableHead>
                <TableHead className="text-right">جزییات بیمه</TableHead>
                <TableHead className="text-right">نوع بیمه</TableHead>
                <TableHead className="text-right">نام مشتری</TableHead>
                <TableHead onClick={() => handlePolicySort("policyNumber")} className="cursor-pointer hover:bg-gray-50 text-right">شماره</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedPolicies.length > 0 ? (
                paginatedPolicies.map((policy) => (
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
                    <TableCell>{toPersianDigits((policy.installmentsCount || 0).toString())}</TableCell>
                    <TableCell>{toPersianDigits(formatPrice(policy.premium))}</TableCell>
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
          {filteredPolicies.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPagePolicies(prev => Math.max(prev - 1, 1))}
                      className={currentPagePolicies === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPagesPolicies }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPagePolicies}
                        onClick={() => setCurrentPagePolicies(page)}
                        className="cursor-pointer"
                      >
                        {toPersianDigits(page.toString())}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPagePolicies(prev => Math.min(prev + 1, totalPagesPolicies))}
                      className={currentPagePolicies === totalPagesPolicies ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
}
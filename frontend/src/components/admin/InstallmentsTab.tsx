import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TabsContent } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import api from '../../utils/api';
import { ClientOnlyDatePicker } from "../ui/ClientOnlyDatePicker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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
import { Slider } from "../ui/slider";

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

interface InstallmentsTabProps {
  installments: Installment[];
  setInstallments: React.Dispatch<React.SetStateAction<Installment[]>>;
  loading: boolean;
  token: string;
}

export function InstallmentsTab({ installments, setInstallments, loading, token }: InstallmentsTabProps) {
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
  const [markAsPaidInstallment, setMarkAsPaidInstallment] = useState<Installment | null>(null);
  const [showAddInstallmentForm, setShowAddInstallmentForm] = useState(false);

  const [installmentSearchQuery, setInstallmentSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("");
  const [sortState, setSortState] = useState<Record<string, number>>({});

  // Filter states for installments
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]); // Default range
  const [priceMinMax, setPriceMinMax] = useState({min: 0, max: 10000000});

  // Update price range min/max based on installments data
  useEffect(() => {
    if (installments.length > 0) {
      const amounts = installments.map(i => parseFloat(i.amount.replace(/,/g, '')));
      const min = Math.min(...amounts);
      const max = Math.max(...amounts);
      setPriceMinMax({ min, max });
      setPriceRange([min, max]);
    }
  }, [installments]);
  const [selectedInsuranceType, setSelectedInsuranceType] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [dateSortOrder, setDateSortOrder] = useState<string>("none"); // "none" | "newest" | "oldest"

  const toPersianDigits = (str: string) => str.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);

  const formatPrice = (price: string) => {
    if (!price) return "0 ریال";
    const integerPart = String(price).split('.')[0];
    const formatted = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `${formatted} ریال`;
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
      installment_number: 1, // Default for new installments
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
        due_date: formDataInstallment.dueDate, // Already in Jalaali format
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

  const handleMarkAsPaid = async () => {
    if (!markAsPaidInstallment) return;
    try {
      await api.put(`/installments/${markAsPaidInstallment.id}`, { status: 'پرداخت شده' }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setInstallments(installments.map(i => i.id === markAsPaidInstallment.id ? { ...i, status: 'پرداخت شده' } : i));
      toast.success("وضعیت قسط به پرداخت شده تغییر یافت.");
      setMarkAsPaidInstallment(null);
    } catch (error) {
      console.error(error);
      toast.error("خطا در تغییر وضعیت");
    }
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
    (i) => {
      const matchesSearch =
        i.customerName
          .toLowerCase()
          .includes(installmentSearchQuery.toLowerCase()) ||
        i.policyType.toLowerCase().includes(installmentSearchQuery.toLowerCase());

      const matchesPrice = parseFloat(i.amount.replace(/,/g, '')) >= priceRange[0] && parseFloat(i.amount.replace(/,/g, '')) <= priceRange[1];

      const matchesType = selectedInsuranceType === "all" || i.policyType === selectedInsuranceType;

      const matchesStatus = selectedStatus === "all" || i.status === selectedStatus;

      return matchesSearch && matchesPrice && matchesType && matchesStatus;
    }
  );

  const handleSort = (field: string) => {
    setSortState(prev => {
      const newState = { ...prev };
      if (sortField === field) {
        newState[field] = (newState[field] || 0) + 1;
        if (field === 'status' && newState[field] > 2) newState[field] = 0;
        else if (field === 'amount' && newState[field] > 1) newState[field] = 0;
        else if (newState[field] > 1) newState[field] = 0;
      } else {
        setSortField(field);
        newState[field] = 0;
      }
      return newState;
    });
  };

  const getSortValue = (field: string, item: Installment) => {
    if (field === 'status') {
      const orders = [
        ['معوق', 'آینده', 'پرداخت شده'], // 0: overdue first
        ['آینده', 'معوق', 'پرداخت شده'], // 1: future first
        ['پرداخت شده', 'معوق', 'آینده'], // 2: paid first
      ];
      const order = orders[sortState[field] || 0];
      return order.indexOf(item.status);
    } else if (field === 'amount') {
      return parseFloat(item.amount.replace(/,/g, ''));
    } else if (field === 'dueDate') {
      return new Date(item.dueDate).getTime();
    } else {
      return item[field as keyof Installment] as string;
    }
  };

  const sortedInstallments = [...filteredInstallments].sort((a, b) => {
    // First apply date sort if selected
    if (dateSortOrder !== 'none') {
      const aDate = new Date(a.dueDate).getTime();
      const bDate = new Date(b.dueDate).getTime();
      if (dateSortOrder === 'newest') {
        return bDate - aDate; // newest first
      } else if (dateSortOrder === 'oldest') {
        return aDate - bDate; // oldest first
      }
    }

    // Then apply table sort
    if (!sortField) return 0;
    const aVal = getSortValue(sortField, a);
    const bVal = getSortValue(sortField, b);
    let cmp = 0;
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      cmp = aVal - bVal;
    } else {
      cmp = String(aVal).localeCompare(String(bVal));
    }
    const mode = sortState[sortField] || 0;
    if (sortField === 'status') {
      return cmp;
    } else if (sortField === 'amount') {
      return mode === 0 ? -cmp : cmp; // 0: desc, 1: asc
    } else {
      return mode === 0 ? cmp : -cmp; // 0: asc, 1: desc
    }
  });

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
      case "آینده":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            آینده
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <TabsContent value="installments">
      <Card className="shadow-green-100 shadow-xl ring-2 ring-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {loading ? <Skeleton className="h-6 w-24" /> : <CardTitle>مدیریت اقساط</CardTitle>}
            </div>
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
                  <Input
                    id="installment-amount"
                    name="amount"
                    value={formDataInstallment.amount}
                    onChange={(e) =>
                      setFormDataInstallment({
                        ...formDataInstallment,
                        amount: e.target.value,
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

          {/* Filter Section */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4 text-right">فیلترها</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Price Range Slider */}
              <div className="space-y-2">
                <Label className="text-right block">محدوده مبلغ قسط (ریال)</Label>
                <Slider
                  value={priceRange}
                  onValueChange={(value) => setPriceRange(value as [number, number])}
                  max={priceMinMax.max}
                  min={priceMinMax.min}
                  step={100000}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-black">
                  <span>{toPersianDigits(formatPrice(priceRange[0].toString()))}</span>
                  <span>{toPersianDigits(formatPrice(priceRange[1].toString()))}</span>
                </div>
              </div>

              {/* Insurance Type Select */}
              <div className="space-y-2">
                <Label className="text-right block">نوع بیمه</Label>
                <Select value={selectedInsuranceType} onValueChange={setSelectedInsuranceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب نوع بیمه" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    {Array.from(new Set(installments.map(i => i.policyType))).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Select */}
              <div className="space-y-2">
                <Label className="text-right block">وضعیت</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب وضعیت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">همه</SelectItem>
                    <SelectItem value="معوق">معوق</SelectItem>
                    <SelectItem value="آینده">آینده</SelectItem>
                    <SelectItem value="پرداخت شده">پرداخت شده</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Sort */}
              <div className="space-y-2">
                <Label className="text-right block"> بر اساس سررسید</Label>
                <Select value={dateSortOrder} onValueChange={setDateSortOrder}>
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب مرتب‌سازی" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون مرتب‌سازی</SelectItem>
                    <SelectItem value="newest">جدیدترین</SelectItem>
                    <SelectItem value="oldest">قدیمی‌ترین</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

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
                  className="cursor-pointer hover:bg-gray-50 text-center"
                >
                  وضعیت
                </TableHead>
                <TableHead className="text-right">شماره قسط</TableHead>
                <TableHead className="text-right">روز تاخیر</TableHead>
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
                      <div className="flex items-center gap-2">
                        {getStatusBadge(installment.status)}
                        {installment.status !== 'پرداخت شده' && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setMarkAsPaidInstallment(installment)}
                              >
                                پرداخت شد
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>تایید پرداخت</AlertDialogTitle>
                                <AlertDialogDescription>
                                  آیا مطمئن هستید که این قسط را به عنوان پرداخت شده علامت بزنید؟
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setMarkAsPaidInstallment(null)}>لغو</AlertDialogCancel>
                                <AlertDialogAction onClick={handleMarkAsPaid}>
                                  تایید
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{toPersianDigits(installment.installment_number.toString())}</TableCell>
                    <TableCell>
                      {installment.status === 'پرداخت شده' ? (
                        "-"
                      ) : installment.daysOverdue > 0 ? (
                        <span className="text-red-600">
                          {toPersianDigits(installment.daysOverdue.toString())} روز
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>{installment.dueDate}</TableCell>
                    <TableCell>{toPersianDigits(formatPrice(installment.amount))}</TableCell>
                    <TableCell>{installment.policyType}</TableCell>
                    <TableCell>{installment.customerName}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    هیچ قسطی یافت نشد.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
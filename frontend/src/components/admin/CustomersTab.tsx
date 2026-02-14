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
import { Label } from "../ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationNumbers,
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
import type { Customer, FormData } from "../../types/admin";
import { toPersianDigits, translateRole } from "../../utils/adminUtils";

interface CustomersTabProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  loading: boolean;
  token: string;
  onSearch?: (query: string) => void;
}

export function CustomersTab({ customers, setCustomers, loading, token, onSearch }: CustomersTabProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    nationalCode: "",
    insuranceCode: "",
    phone: "",
    email: "",
    birthDate: "",
    score: "A",
    role: "customer",
  });
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null);
  const [toggleCustomer, setToggleCustomer] = useState<Customer | null>(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState(() => localStorage.getItem('customersSearchQuery') || "");
  const [sortBy, setSortBy] = useState<'name' | 'score' | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    localStorage.setItem('customersSearchQuery', searchQuery);
  }, [searchQuery]);

  const sortedCustomers = [...customers].sort((a, b) => {
    if (!sortBy) return 0;
    if (sortBy === 'name') {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (sortOrder === 'asc') {
        return aName.localeCompare(bName);
      } else {
        return bName.localeCompare(aName);
      }
    } else if (sortBy === 'score') {
      const scoreOrder = ['A', 'B', 'C', 'D'];
      const aIndex = scoreOrder.indexOf(a.score);
      const bIndex = scoreOrder.indexOf(b.score);
      if (sortOrder === 'asc') {
        return aIndex - bIndex;
      } else {
        return bIndex - aIndex;
      }
    }
    return 0;
  });

  const handleSort = (column: 'name' | 'score') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const totalPages = Math.ceil(sortedCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = sortedCustomers.slice(startIndex, startIndex + itemsPerPage);

  const handleAddCustomer = async () => {
    if (!formData.name.trim() || !formData.nationalCode.trim() || !formData.phone.trim()) {
      toast.error("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    try {
      const response = await api.post('/admin/customers', {
        full_name: formData.name,
        national_code: formData.nationalCode,
        insurance_code: formData.insuranceCode || "",
        phone: formData.phone,
        birth_date: formData.birthDate,
        score: formData.score,
        role: formData.role,
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
        role: "customer",
      });
      setShowCustomerForm(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در افزودن کاربر');
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
        role: formData.role,
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
        role: "customer",
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
      toast.error('خطا در حذف کاربر');
    }
  };

  const handleToggleStatus = async () => {
    if (!toggleCustomer) return;
    try {
      const newStatus = toggleCustomer.status === 'فعال' ? 'غیرفعال' : 'فعال';
      await api.put(`/admin/customers/${toggleCustomer.id}`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomers(customers.map(c => c.id === toggleCustomer.id ? { ...c, status: newStatus } : c));
      toast.success('وضعیت کاربر با موفقیت تغییر یافت');
      setToggleCustomer(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error('خطا در تغییر وضعیت کاربر');
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
      role: (customer.role as 'customer' | 'admin' | 'admin-2' | 'admin-3') || 'customer',
    });
    setShowCustomerForm(true);
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
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <TabsContent value="customers">
      <Card className="shadow-green-100 shadow-xl ring-2 ring-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {loading ? <Skeleton className="h-6 w-32" /> : <CardTitle>مدیریت کاربران</CardTitle>}
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
                  role: "customer",
                });
                setShowCustomerForm((prev) => !prev);
              }}
              variant={showCustomerForm ? "outline" : "default"}
            >
              <Plus className="h-4 w-4 ml-2" />
              افزودن کاربر
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
                      نام و نام خانوادگی <span className="text-red-500">*</span>
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
                      کد ملی <span className="text-red-500">*</span>
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
                      شماره تماس <span className="text-red-500">*</span>
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
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="role" className="text-right">
                      نقش
                    </Label>
                    <Select
                      name="role"
                      value={formData.role}
                      onValueChange={(value: 'customer' | 'admin' | 'admin-2' | 'admin-3') =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="customer">مشتری</SelectItem>
                        <SelectItem value="admin">ادمین</SelectItem>
                        <SelectItem value="admin-2">ادمین درجه ۲</SelectItem>
                        <SelectItem value="admin-3">ادمین درجه ۳</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <Button onClick={editingCustomer ? handleEditCustomer : handleAddCustomer}>
                    {editingCustomer ? "ذخیره تغییرات" : "ثبت کاربر"}
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
                        role: "customer",
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
                placeholder="جستجو در کاربران..."
                dir="rtl"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) {
                    onSearch(e.target.value);
                  }
                }}
                className="pr-10"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left pl-8">عملیات</TableHead>
                <TableHead className="text-right">وضعیت</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('score')}>
                  امتیاز {sortBy === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-right">نقش</TableHead>
                <TableHead className="text-right">بیمه‌نامه‌های فعال</TableHead>
                <TableHead className="text-right">شماره تماس</TableHead>
                <TableHead className="text-right">کد ملی</TableHead>
                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('name')}>
                  نام و نام خانوادگی {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : sortedCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-gray-500">هیچ مشتری‌ای یافت نشد.</p>
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
                            role: "customer",
                          });
                          setShowCustomerForm(true);
                        }}
                        variant="outline"
                      >
                        افزودن مشتری جدید
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCustomers.map((customer) => (
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
                              <AlertDialogTitle>حذف کاربر</AlertDialogTitle>
                              <AlertDialogDescription>
                                آیا مطمئن هستید که می‌خواهید این کاربر را
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
                    <TableCell>
                      <button
                        onClick={() => setToggleCustomer(customer)}
                        className="cursor-pointer"
                      >
                        {getStatusBadge(customer.status)}
                      </button>
                    </TableCell>
                    <TableCell>{customer.score}</TableCell>
                    <TableCell>{translateRole(customer.role || 'customer')}</TableCell>
                    <TableCell>{toPersianDigits(customer.activePolicies.toString())}</TableCell>
                    <TableCell>{customer.phone}</TableCell>
                    <TableCell>{customer.nationalCode}</TableCell>
                    <TableCell>{customer.name}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          {sortedCustomers.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                  <PaginationNumbers
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!toggleCustomer} onOpenChange={() => setToggleCustomer(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تغییر وضعیت کاربر</AlertDialogTitle>
            <AlertDialogDescription>
              آیا مطمئن هستید که می‌خواهید وضعیت {toggleCustomer?.name} را به {toggleCustomer?.status === 'فعال' ? 'غیرفعال' : 'فعال'} تغییر دهید؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>لغو</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus}>
              تایید
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TabsContent>
  );
}
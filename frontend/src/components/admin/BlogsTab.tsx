import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
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
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import api from '../../utils/api';
import { ClientOnlyDatePicker } from "../ui/ClientOnlyDatePicker";
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
import type { Blog } from "../../hooks/useBlogs";

interface BlogAPI {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  image_path?: string;
  created_at: string;
}

interface BlogsTabProps {
  blogs: Blog[];
  setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
  loading: boolean;
  token: string;
}

export function BlogsTab({ blogs, setBlogs, loading, token }: BlogsTabProps) {
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [formDataBlog, setFormDataBlog] = useState({
    title: "",
    summary: "",
    content: "",
    date: "",
    imageFile: null as File | null,
    category: "",
  });
  const [showAddBlogForm, setShowAddBlogForm] = useState(false);
  const [blogSearchQuery, setBlogSearchQuery] = useState("");
  const [deleteBlogId, setDeleteBlogId] = useState<string | null>(null);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(blogSearchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(blogSearchQuery.toLowerCase())
  );

  const handleAddBlog = async () => {
    if (!formDataBlog.title.trim() || !formDataBlog.summary.trim() || !formDataBlog.content.trim()) {
      alert("لطفا تمام فیلدهای مورد نیاز را پر کنید.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', formDataBlog.title);
      formData.append('summary', formDataBlog.summary);
      formData.append('content', formDataBlog.content);
      formData.append('category', formDataBlog.category);
      if (formDataBlog.imageFile) {
        formData.append('image', formDataBlog.imageFile);
      }
      await api.post('/admin/blogs', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refetch blogs
      const response = await api.get('/blogs');
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
      setFormDataBlog({
        title: "",
        summary: "",
        content: "",
        date: "",
        imageFile: null,
        category: "",
      });
      setShowAddBlogForm(false);
    } catch (error) {
      console.error('Error adding blog:', error);
      alert('خطا در افزودن مقاله');
    }
  };

  const handleEditBlog = async () => {
    if (!editingBlog) return;
    try {
      await api.put(`/admin/blogs/${editingBlog.id}`, {
        title: formDataBlog.title,
        summary: formDataBlog.summary,
        content: formDataBlog.content,
        category: formDataBlog.category,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refetch blogs
      const response = await api.get('/blogs');
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
      setFormDataBlog({
        title: "",
        summary: "",
        content: "",
        date: "",
        imageFile: null,
        category: "",
      });
      setShowAddBlogForm(false);
      setEditingBlog(null);
    } catch (error) {
      console.error('Error editing blog:', error);
      alert('خطا در ویرایش مقاله');
    }
  };

  const handleDeleteBlog = async () => {
    if (!deleteBlogId) return;
    try {
      await api.delete(`/admin/blogs/${deleteBlogId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refetch blogs
      const response = await api.get('/blogs');
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
      setDeleteBlogId(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('خطا در حذف مقاله');
    }
  };

  const openEditBlogDialog = (blog: Blog) => {
    setEditingBlog(blog);
    setFormDataBlog({
      title: blog.title,
      summary: blog.summary,
      content: blog.content,
      date: blog.date,
      imageFile: null, // For edit, not handling image change yet
      category: blog.category,
    });
    setShowAddBlogForm(true);
  };

  return (
    <TabsContent value="blogs">
      <Card className="shadow-green-100 shadow-xl ring-2 ring-green-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              {loading ? <Skeleton className="h-6 w-24" /> : <CardTitle>مدیریت اخبار</CardTitle>}
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
                    عنوان <span className="text-red-500">*</span>
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
                  <Label htmlFor="blog-summary" className="text-right">
                    خلاصه <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="blog-summary"
                    name="blog-summary"
                    value={formDataBlog.summary}
                    onChange={(e) =>
                      setFormDataBlog({
                        ...formDataBlog,
                        summary: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="blog-content" className="text-right">
                    محتوا <span className="text-red-500">*</span>
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
                        imageFile: e.target.files
                          ? e.target.files[0]
                          : null,
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
                        summary: "",
                        content: "",
                        date: "",
                        imageFile: null,
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
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-8 w-16" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : filteredBlogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <p className="text-gray-500">هیچ مقاله‌ای یافت نشد.</p>
                      <Button onClick={() => setShowAddBlogForm(true)} variant="outline">
                        افزودن مقاله جدید
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredBlogs.map((blog) => (
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </TabsContent>
  );
}
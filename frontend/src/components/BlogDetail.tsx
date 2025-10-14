import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, ArrowRight } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useBlogs } from '../hooks/useBlogs';

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const { blogs } = useBlogs();
  const navigate = useNavigate();

  const blog = blogs.find(b => b.id === id);

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl mb-4">مقاله یافت نشد</h1>
          <Button onClick={() => window.location.href = '/blogs'}>بازگشت به لیست مقالات</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate('/blogs')} className="group">
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            بازگشت به لیست مقالات
          </Button>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-gradient-to-br from-teal-400 to-green-400 text-white px-3 py-1 rounded-full text-sm">
              {blog.category}
            </span>
          </div>

          <h1 className="text-4xl mb-4">{blog.title}</h1>

          <div className="flex items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{blog.date}</span>
            </div>
          </div>
        </div>

        {/* Article Image */}
        {blog.image_path && (
          <div className="mb-8">
            <ImageWithFallback
              src={`${import.meta.env.VITE_PROD_URI}${blog.image_path}`}
              alt={blog.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Article Content */}
        <Card className="border-0 shadow-md">
          <CardContent className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {blog.summary}
              </p>

              <div className="whitespace-pre-line leading-relaxed">
                {blog.content}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Related Articles or Footer */}
        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => navigate('/blogs')}>
            مشاهده سایر مقالات
          </Button>
        </div>
      </div>
    </div>
  );
}
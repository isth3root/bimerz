import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Calendar, ArrowLeft } from "lucide-react";
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useBlogs } from '../hooks/useBlogs';
import { useNavigate } from 'react-router-dom';

export default function Blogs() {
  const { blogs } = useBlogs();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl mb-4">مطالب مفید و آموزشی در زمینه بیمه</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                loading="lazy"
                  src={post.image_path ? `${import.meta.env.VITE_PROD_URI}${post.image_path}` : ''}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-gradient-to-br from-teal-400 to-green-400 text-white px-3 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="text-lg line-clamp-2 hover:text-green-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-3">
                  {post.summary}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>

                <Button variant="ghost" className="w-full group" onClick={() => navigate(`/blogs/${post.id}`)}>
                  ادامه مطلب
                  <ArrowLeft className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
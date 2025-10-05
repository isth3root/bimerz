import { useState, useEffect } from 'react';
import api from '../utils/api';

export interface Blog {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  image_path?: string;
  date: string;
}

interface BlogAPI {
  id: number;
  title: string;
  summary: string;
  content: string;
  category: string;
  image_path?: string;
  created_at: string;
}

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
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
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();

    const handleFocus = () => {
      fetchBlogs();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const addBlog = (blog: Omit<Blog, 'id'>) => {
    // This is for admin, but since we're fetching from API, perhaps not needed
    // But to keep compatibility, maybe just update local state
    const newBlog: Blog = {
      ...blog,
      id: Date.now().toString()
    };
    setBlogs([...blogs, newBlog]);
  };

  const updateBlog = (id: string, updatedBlog: Partial<Blog>) => {
    setBlogs(blogs.map(blog =>
      blog.id === id ? { ...blog, ...updatedBlog } : blog
    ));
  };

  const deleteBlog = (id: string) => {
    setBlogs(blogs.filter(blog => blog.id !== id));
  };

  return { blogs, addBlog, updateBlog, deleteBlog, loading };
}
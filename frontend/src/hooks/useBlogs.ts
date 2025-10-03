import { useState, useEffect } from 'react';
import type { Blog } from '../data/blogsData';
import { blogsData } from '../data/blogsData';

export function useBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    // Load from localStorage or use default data
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      setBlogs(JSON.parse(storedBlogs));
    } else {
      setBlogs(blogsData);
      localStorage.setItem('blogs', JSON.stringify(blogsData));
    }
  }, []);

  const addBlog = (blog: Omit<Blog, 'id'>) => {
    const newBlog: Blog = {
      ...blog,
      id: Date.now().toString()
    };
    const updatedBlogs = [...blogs, newBlog];
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const updateBlog = (id: string, updatedBlog: Partial<Blog>) => {
    const updatedBlogs = blogs.map(blog =>
      blog.id === id ? { ...blog, ...updatedBlog } : blog
    );
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const deleteBlog = (id: string) => {
    const updatedBlogs = blogs.filter(blog => blog.id !== id);
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  return { blogs, addBlog, updateBlog, deleteBlog };
}
import axios from 'axios';
import { BlogWithRelations, BlogFilters, CreateBlogData, UpdateBlogData, CommentResponse } from '@/types/blog';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export class BlogService {
  static async getBlogs(filters: BlogFilters): Promise<BlogWithRelations[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs`, { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching blogs:", error);
      throw error;
    }
  }

  static async getBlogById(id: string): Promise<BlogWithRelations> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching blog:", error);
      throw error;
    }
  }

  static async createBlog(data: CreateBlogData): Promise<BlogWithRelations> {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/blogs`, data);
      return response.data;
    } catch (error) {
      console.error("Error creating blog:", error);
      throw error;
    }
  }

  static async updateBlog(id: string, data: UpdateBlogData): Promise<BlogWithRelations> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/blogs/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error updating blog:", error);
      throw error;
    }
  }

  static async deleteBlog(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/api/blogs/${id}`);
    } catch (error) {
      console.error("Error deleting blog:", error);
      throw error;
    }
  }

  static async likeBlog(id: string): Promise<{ likes: number; isLiked: boolean }> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/api/blogs/${id}/like`);
      return response.data;
    } catch (error) {
      console.error("Error liking blog:", error);
      throw error;
    }
  }

  static async commentOnBlog(id: string, content: string): Promise<CommentResponse> {
    try {
      const response = await axios.post(`/api/blogs/${id}/comments`, { content });
      return response.data;
    } catch (error) {
      console.error("Error commenting on blog:", error);
      throw error;
    }
  }

  static async likeComment(commentId: string): Promise<{ likes: number; isLiked: boolean }> {
    try {
      const response = await axios.patch(`/api/blogs/${commentId}/comment-like`);
      return response.data;
    } catch (error) {
      console.error("Error liking comment:", error);
      throw error;
    }
  }
} 
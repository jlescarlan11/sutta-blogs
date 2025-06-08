import { BlogEntry, UserCommented, User } from "@prisma/client";

export type BlogWithRelations = BlogEntry & {
  author: User;
  comments: (UserCommented & {
    user: User;
    likes: {
      userId: string;
      commentId: string;
    }[];
  })[];
  _count?: {
    comments?: number;
    likes?: number;
    views?: number;
  };
};

export type BlogFilters = {
  search?: string;
  author?: string;
  sort?: string;
};

export type CreateBlogData = {
  title: string;
  content: string;
  isPublished?: boolean;
};

export type UpdateBlogData = Partial<CreateBlogData>;

export type CommentResponse = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  blogId: string;
  user: User;
  likes: {
    userId: string;
    commentId: string;
  }[];
}; 
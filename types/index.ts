export interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
  emailVerified: Date | null;
}

export interface Comment {
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
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  author: User;
  comments: Comment[];
} 
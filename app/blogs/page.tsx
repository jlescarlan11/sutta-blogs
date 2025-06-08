import prisma from "@/prisma/client";
import { Blog } from "@/types";
import BlogTable from "./BlogTable";
import Header from "./Header";
import { getServerSession } from "next-auth";
import authOptions from "../auth/authOptions";
import { redirect } from "next/navigation";

const BlogsPage = async () => {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const blogsData = await prisma.blogEntry.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
      author: true,
    },
  });

  // Transform the data to match our expected types
  const blogs: Blog[] = blogsData.map((blog) => ({
    id: blog.id,
    title: blog.title,
    content: blog.content,
    isPublished: blog.isPublished,
    createdAt: blog.createdAt,
    updatedAt: blog.updatedAt,
    userId: blog.userId,
    author: blog.author,
    comments: blog.comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
      userId: comment.userId,
      blogId: comment.blogId,
      user: comment.user,
      likes: [], // Initialize with empty likes array since we're not using them in the table
    })),
  }));

  return (
    <div className="">
      <Header />
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogsPage;

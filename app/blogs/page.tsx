import prisma from "@/prisma/client";
import { Blog } from "@/types";
import BlogTable from "./BlogTable";
import Header from "./Header";

const BlogsPage = async () => {
  const blogsData = await prisma.blogEntry.findMany({
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
    ...blog,
    comments: blog.comments.map((comment) => ({
      ...comment,
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

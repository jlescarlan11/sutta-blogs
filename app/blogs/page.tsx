import prisma from "@/prisma/client";
import BlogTable from "./BlogTable";
import { Blog } from "@/types";

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
  const blogs: Blog[] = blogsData.map(blog => ({
    ...blog,
    comments: blog.comments.map(comment => ({
      ...comment,
      likes: [], // Initialize with empty likes array since we're not using them in the table
    })),
  }));

  return (
    <div>
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogsPage;

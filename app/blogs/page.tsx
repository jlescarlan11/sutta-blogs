import prisma from "@/prisma/client";
import BlogTable from "./BlogTable";

const BlogsPage = async () => {
  const blogs = await prisma.blogEntry.findMany({
    include: {
      comments: {
        include: {
          user: true
        }
      },
      author: true
    }
  });

  return (
    <div>
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogsPage;

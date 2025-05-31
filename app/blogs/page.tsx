import prisma from "@/prisma/client";
import BlogTable from "./BlogTable";

const BlogsPage = async () => {
  const blogs = await prisma.blog.findMany();

  return (
    <div>
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogsPage;

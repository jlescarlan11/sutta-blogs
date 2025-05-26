import prisma from "@/prisma/client";
import { Button } from "@radix-ui/themes";
import Link from "next/link";
import BlogTable from "./BlogTable";

const BlogsPage = async () => {
  const blogs = await prisma.blog.findMany();

  return (
    <div>
      <Button>
        <Link href="/blogs/new">New Blog</Link>
      </Button>
      <BlogTable blogs={blogs} />
    </div>
  );
};

export default BlogsPage;

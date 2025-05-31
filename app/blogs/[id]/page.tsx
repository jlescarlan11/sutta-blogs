// app/blogs/[id]/page.tsx
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: { id: string };
}

const BlogDetails = async ({ params }: Props) => {
  // First await the params if needed (though usually params is available synchronously)
  const { id } = await params;
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    return notFound();
  }

  return (
    <div>
      <h1 className="text-xl font-bold">{blog.title}</h1>
      <p className="text-gray-500">{blog.createdAt.toDateString()}</p>
      <div>{blog.content}</div>
    </div>
  );
};

export default BlogDetails;

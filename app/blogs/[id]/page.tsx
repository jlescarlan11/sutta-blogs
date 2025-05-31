import prisma from "@/prisma/client";
import React from "react";

interface Props {
  params: { id: string };
}

const BlogDetails = async ({ params }: Props) => {
  const blog = await prisma.blog.findUnique({
    where: {
      id: params.id,
    },
  });

  return (
    <div>
      <p>{blog?.title}</p>
      <p>{blog?.createdAt.toDateString()}</p>
      <p>{blog?.content}</p>
    </div>
  );
};

export default BlogDetails;

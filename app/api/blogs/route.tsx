import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { createBlogSchema } from "../../ValidationSchema";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const validation = createBlogSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const newBlog = await prisma.blog.create({
    data: {
      title: body.title,
      content: body.content,
      readTime: body.readTime,
      published: body.published,
    },
  });

  return NextResponse.json(newBlog, { status: 201 });
}

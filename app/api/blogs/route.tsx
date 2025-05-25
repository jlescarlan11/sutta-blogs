import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createBlogSchema = z.object({
  title: z.string().min(1).max(55),
  content: z.string().min(1),
  readTime: z.number().min(1),
  published: z.boolean(),
});

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

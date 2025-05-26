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

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids)
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

    const blogs = await prisma.blog.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      select: {
        id: true,
      },
    });

    if (blogs.length === 0) {
      return NextResponse.json(
        { error: "No matching blogs found" },
        { status: 404 }
      );
    }

    await prisma.blog.deleteMany({
      where: {
        id: {
          in: blogs.map((blog) => blog.id),
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

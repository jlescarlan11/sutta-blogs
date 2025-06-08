import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { createBlogSchema } from "../../ValidationSchema";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const validation = createBlogSchema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const newBlog = await prisma.blogEntry.create({
    data: {
      title: body.title,
      content: body.content,
      isPublished: body.isPublished,
      readTime: body.readTime,
      createdAt: body.createdAt,
      updatedAt: body.updatedAt,
      userId: session.user.id,
    },
  });

  return NextResponse.json(newBlog, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  try {
    const { ids } = await request.json();

    if (!ids)
      return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

    const blogs = await prisma.blogEntry.findMany({
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

    await prisma.blogEntry.deleteMany({
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

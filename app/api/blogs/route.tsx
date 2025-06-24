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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const limit = parseInt(searchParams.get('limit') || '3');

    // If no email is provided, return an error
    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email: email },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Fetch the latest published blogs for the user
    const blogs = await prisma.blogEntry.findMany({
      where: {
        userId: user.id,
        isPublished: true
      },
      select: {
        id: true,
        title: true,
        content: true,
        readTime: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json({
      user: {
        name: user.name,
        email: user.email
      },
      blogs: blogs,
      total: blogs.length
    });

  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

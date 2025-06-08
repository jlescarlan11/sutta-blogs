import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await prisma.blogEntry.findUnique({
      where: { id },
      include: {
        author: true,
        comments: {
          include: {
            user: true,
            likes: true,
            _count: {
              select: {
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error in GET /api/blogs/[id]:", error);
    return NextResponse.json({ error: "Error fetching blog" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const updateData: {
      title?: string;
      content?: string;
      isPublished?: boolean;
    } = {};

    if (body.title) updateData.title = body.title;
    if (body.content) updateData.content = body.content;
    if (body.isPublished !== undefined)
      updateData.isPublished = body.isPublished;

    // First check if the blog exists and belongs to the user
    const existingBlog = await prisma.blogEntry.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    if (existingBlog.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updatedBlog = await prisma.blogEntry.update({
      where: { id },
      data: updateData,
      include: {
        author: true,
        comments: {
          include: {
            user: true,
          },
        },
        likes: true,
        views: true,
      },
    });

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error in PATCH /api/blogs/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // First check if the blog exists and belongs to the user
    const existingBlog = await prisma.blogEntry.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    if (existingBlog.userId !== session.user.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.blogEntry.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error in DELETE /api/blogs/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

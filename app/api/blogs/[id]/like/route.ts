import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authOptions from "@/app/auth/authOptions";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if the blog exists
    const blog = await prisma.blogEntry.findUnique({
      where: { id: params.id },
      include: {
        likes: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if user has already liked the blog
    const existingLike = await prisma.userLiked.findFirst({
      where: {
        blogId: params.id,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      // Unlike the blog
      await prisma.userLiked.delete({
        where: {
          userId_blogId: {
            userId: session.user.id,
            blogId: params.id,
          },
        },
      });
    } else {
      // Like the blog
      await prisma.userLiked.create({
        data: {
          blogId: params.id,
          userId: session.user.id,
        },
      });
    }

    // Get updated like count
    const updatedBlog = await prisma.blogEntry.findUnique({
      where: { id: params.id },
      include: {
        likes: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json({
      likes: updatedBlog?._count.likes || 0,
      isLiked: !existingLike,
    });
  } catch (error) {
    console.error("Error in PATCH /api/blogs/[id]/like:", error);
    return NextResponse.json(
      { error: "Error updating like status" },
      { status: 500 }
    );
  }
} 
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

    // Check if the comment exists
    const comment = await prisma.userCommented.findUnique({
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

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user has already liked the comment
    const existingLike = await prisma.userCommentLike.findFirst({
      where: {
        commentId: params.id,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      // Unlike the comment
      await prisma.userCommentLike.delete({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId: params.id,
          },
        },
      });
    } else {
      // Like the comment
      await prisma.userCommentLike.create({
        data: {
          commentId: params.id,
          userId: session.user.id,
        },
      });
    }

    // Get updated like count
    const updatedComment = await prisma.userCommented.findUnique({
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
      likes: updatedComment?._count.likes || 0,
      isLiked: !existingLike,
    });
  } catch (error) {
    console.error("Error in PATCH /api/blogs/[id]/comment-like:", error);
    return NextResponse.json(
      { error: "Error updating like status" },
      { status: 500 }
    );
  }
} 
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import authOptions from "@/app/auth/authOptions";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { error: "Content is required" },
        { status: 400 }
      );
    }

    // First check if the blog exists
    const blog = await prisma.blogEntry.findUnique({
      where: { id: id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    const comment = await prisma.userCommented.create({
      data: {
        content,
        userId: session.user.id,
        blogId: id,
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Error in POST /api/blogs/[id]/comments:", error);
    return NextResponse.json(
      { error: "Error creating comment" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { content, commentId } = body;

    if (!content || !commentId) {
      return NextResponse.json(
        { error: "Content and commentId are required" },
        { status: 400 }
      );
    }

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.userCommented.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updatedComment = await prisma.userCommented.update({
      where: { id: commentId },
      data: { content },
      include: {
        user: true,
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error in PUT /api/blogs/[id]/comments:", error);
    return NextResponse.json(
      { error: "Error updating comment" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if the comment exists and belongs to the user
    const existingComment = await prisma.userCommented.findUnique({
      where: { id: commentId },
    });

    if (!existingComment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (existingComment.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.userCommented.delete({
      where: { id: commentId },
    });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/blogs/[id]/comments:", error);
    return NextResponse.json(
      { error: "Error deleting comment" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "Comment ID is required" },
        { status: 400 }
      );
    }

    // Check if the comment exists
    const comment = await prisma.userCommented.findUnique({
      where: { id: commentId },
      include: {
        user: true,
      },
    });

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Check if user has already liked the comment
    const existingLike = await prisma.userCommentLike.findFirst({
      where: {
        commentId,
        userId: session.user.id,
      },
    });

    if (existingLike) {
      // Unlike the comment
      await prisma.userCommentLike.delete({
        where: {
          userId_commentId: {
            userId: session.user.id,
            commentId: commentId,
          },
        },
      });
    } else {
      // Like the comment
      await prisma.userCommentLike.create({
        data: {
          commentId,
          userId: session.user.id,
        },
      });
    }

    // Get updated comment with likes
    const updatedComment = await prisma.userCommented.findUnique({
      where: { id: commentId },
      include: {
        user: true,
        likes: true,
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return NextResponse.json(updatedComment);
  } catch (error) {
    console.error("Error in PATCH /api/blogs/[id]/comments:", error);
    return NextResponse.json(
      { error: "Error updating like status" },
      { status: 500 }
    );
  }
}

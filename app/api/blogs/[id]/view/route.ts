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

    // Check if the blog exists
    const blog = await prisma.blogEntry.findUnique({
      where: { id: id },
    });

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if user has already viewed the blog in the last 24 hours
    const lastView = await prisma.userViewed.findFirst({
      where: {
        blogId: id,
        userId: session.user.id,
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        },
      },
    });

    if (!lastView) {
      // Record new view
      await prisma.userViewed.create({
        data: {
          blogId: id,
          userId: session.user.id,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/blogs/[id]/view:", error);
    return NextResponse.json(
      { error: "Error recording view" },
      { status: 500 }
    );
  }
}

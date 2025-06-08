import { NextRequest, NextResponse } from "next/server";
import { BlogService } from "@/services/blogService";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await BlogService.getBlogById(params.id);

    if (!blog) {
      return new NextResponse("Blog not found", { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error("Error in GET /api/blogs/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const updateData: any = {};
    if (body.title !== undefined) updateData.title = body.title;
    if (body.content !== undefined) updateData.content = body.content;
    if (body.isPublished !== undefined) updateData.isPublished = body.isPublished;

    const updatedBlog = await BlogService.updateBlog(params.id, updateData);
    if (!updatedBlog) {
      return new NextResponse("Blog not found", { status: 404 });
    }
    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error("Error in PATCH /api/blogs/[id]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const blog = await prisma.blogEntry.findUnique({
      where: { id: params.id },
    });

    if (!blog) {
      return NextResponse.json(
        { error: "Blog not found" },
        { status: 404 }
      );
    }

    await prisma.blogEntry.delete({
      where: { id: params.id }
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
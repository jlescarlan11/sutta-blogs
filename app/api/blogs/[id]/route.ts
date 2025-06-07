import { NextResponse } from "next/server";
import { BlogService } from "@/services/blogService";

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
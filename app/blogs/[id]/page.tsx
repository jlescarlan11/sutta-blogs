// app/blogs/[id]/page.tsx
import authOptions from "@/app/auth/authOptions";
import prisma from "@/prisma/client";
import { Blog } from "@/types";
import { Box, Container, Flex, Text } from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import {
  FaCalendarAlt,
  FaChevronRight,
  FaRegClock,
  FaRegCommentDots,
  FaRegEye,
  FaUser,
} from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CommentLikeButton from "./CommentLikeButton";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import ViewCounter from "./ViewCounter";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

interface BlogWithCounts extends Blog {
  _count: {
    comments: number;
    likes: number;
    views: number;
  };
  likes: { userId: string; blogId: string }[];
}

const BlogDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const { id } = await params;

  const blog = (await prisma.blogEntry.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      comments: {
        include: {
          user: true,
          likes: true,
        },
      },
      likes: true,
      views: true,
      _count: {
        select: {
          comments: true,
          likes: true,
          views: true,
        },
      },
    },
  })) as BlogWithCounts | null;

  if (!blog) notFound();

  // Calculate read time (assuming average reading speed of 200 words per minute)
  const wordCount = blog.content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <Container>
      <Box className="space-y-4">
        <Text size="8" weight="bold" className="!mb-2">
          {blog.title}
        </Text>
        <Flex gap="4" align="center" className="text-[var(--purple-11)]" mb="2">
          <Flex gap="1" align="center">
            <FaUser />
            <Text size="2">{blog.author.name}</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaCalendarAlt />
            <Text size="2">
              {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaRegClock />
            <Text size="2">{readTime} mins</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaRegEye />
            <Text size="2">{blog._count.views}</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaRegCommentDots />
            <Text size="2">{blog._count.comments}</Text>
          </Flex>
        </Flex>
        <Box className="mb-2 text-[var(--purple-12)]">
          <Box
            className="prose prose-purple max-w-none
  prose-headings:text-[var(--purple-12)]
  prose-lead:text-[var(--purple-12)]
  prose-h1:text-[var(--purple-12)]
  prose-h2:text-[var(--purple-12)]
  prose-h3:text-[var(--purple-12)]
  prose-h4:text-[var(--purple-12)]
  prose-p:text-[var(--purple-12)]
  prose-a:text-[var(--purple-12)]
  prose-blockquote:text-[var(--purple-12)]
  prose-figure:text-[var(--purple-12)]
  prose-figcaption:text-[var(--purple-12)]
  prose-strong:text-[var(--purple-12)]
  prose-em:text-[var(--purple-12)]
  prose-kbd:text-[var(--purple-12)]
  prose-code:text-[var(--purple-12)]
  prose-pre:text-[var(--purple-12)]
  prose-ol:text-[var(--purple-12)]
  prose-ul:text-[var(--purple-12)]
  prose-li:text-[var(--purple-12)]
  prose-table:text-[var(--purple-12)]
  prose-thead:text-[var(--purple-12)]
  prose-tr:text-[var(--purple-12)]
  prose-th:text-[var(--purple-12)]
  prose-td:text-[var(--purple-12)]
  prose-img:text-[var(--purple-12)]
  prose-video:text-[var(--purple-12)]
  prose-hr:text-[var(--purple-12)]"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ul: ({ ...props }) => (
                  <ul className="list-disc pl-6 space-y-1" {...props} />
                ),
                ol: ({ ...props }) => (
                  <ol className="list-decimal pl-6 space-y-1" {...props} />
                ),
                li: ({ ...props }) => (
                  <li className="marker:text-[var(--purple-12)]" {...props} />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
          </Box>
        </Box>
        <Flex gap="4" align="center" mb="2">
          <LikeButton
            blogId={blog.id}
            initialLikes={blog._count.likes}
            isLiked={blog.likes.some((like) => like.userId === userId)}
          />
          <ShareButton blogId={blog.id} />
        </Flex>
        <Link href={`/blogs/${blog.id}/comments`} passHref>
          <Flex
            align="center"
            gap="2"
            className="cursor-pointer text-[var(--purple-11)] hover:underline"
            mb="2"
          >
            <FaRegCommentDots />
            <Text size="3" weight="bold">
              Comments
            </Text>
            <FaChevronRight />
          </Flex>
        </Link>
        <Box asChild>
          <hr className="my-2 border-[var(--purple-6)]" />
        </Box>
        {/* Top 3 comments */}
        {!blog.comments || blog.comments.length === 0 ? (
          <Text size="2" color="purple" className="italic">
            No comments yet.
          </Text>
        ) : (
          [...blog.comments]
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, 3)
            .map((comment, idx, arr) => (
              <React.Fragment key={comment.id}>
                <Box className="mb-2">
                  <Text weight="bold" size="2">
                    {comment.user.name}
                  </Text>
                  <Text size="2" className="block mb-1">
                    {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                  <Text size="2">{comment.content}</Text>
                  <Flex gap="1" align="center" mt="1">
                    <CommentLikeButton
                      commentId={comment.id}
                      initialLikes={comment.likes.length}
                      isLiked={comment.likes.some(
                        (like) => like.userId === userId
                      )}
                    />
                  </Flex>
                </Box>
                {idx < arr.length - 1 && (
                  <Box asChild>
                    <hr className="my-2 border-[var(--purple-6)]" />
                  </Box>
                )}
              </React.Fragment>
            ))
        )}
      </Box>
      <ViewCounter blogId={blog.id} />
    </Container>
  );
};

export default BlogDetailPage;

// app/blogs/[id]/page.tsx
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, Box, Container, Flex, Text } from "@radix-ui/themes";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { FaUser, FaRegHeart, FaShareAlt, FaRegCommentDots, FaRegEye, FaRegClock, FaCalendarAlt, FaChevronRight } from "react-icons/fa";

interface Props {
  params: { id: string };
}

interface User {
  id: string;
  name: string;
  email: string;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  blogId: string;
  user: User;
  likes?: { id: string }[];
}

interface Blog {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  author: User;
  comments: Comment[];
}

const BlogDetailPage = async ({ params }: Props) => {
  const blog = (await prisma.blogEntry.findUnique({
    where: {
      id: params.id,
    },
    include: {
      author: true,
      comments: {
        include: {
          user: true,
        },
      },
    },
  })) as Blog | null;

  if (!blog) notFound();

  return (
    <Container>
      <Box className="space-y-4">
        <Text size="8" weight="bold" className="!mb-2">
          {blog.title}
        </Text>
        <Flex gap="4" align="center" className="text-[var(--plum-11)]" mb="2">
          <Flex gap="1" align="center">
            <FaUser />
            <Text size="2">{blog.author.name}</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaCalendarAlt />
            <Text size="2">{new Date(blog.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaRegClock />
            <Text size="2">20 mins</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaRegEye />
            <Text size="2">20</Text>
          </Flex>
          <Flex gap="1" align="center">
            <FaRegCommentDots />
            <Text size="2">20</Text>
          </Flex>
        </Flex>
        <Box className="mb-2">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {blog.content}
          </ReactMarkdown>
        </Box>
        <Flex gap="4" align="center" mb="2">
          <Flex gap="1" align="center">
            <FaRegHeart />
            <Text size="2">20</Text>
          </Flex>
          <FaShareAlt className="cursor-pointer" />
        </Flex>
        <Link href={`/blogs/${blog.id}/comments`} passHref legacyBehavior>
          <Flex align="center" gap="2" className="cursor-pointer text-[var(--plum-11)] hover:underline" mb="2">
            <FaRegCommentDots />
            <Text size="3" weight="bold">Comments</Text>
            <FaChevronRight />
          </Flex>
        </Link>
        <Box asChild><hr className="my-2 border-[var(--plum-6)]" /></Box>
        {/* Top 3 comments */}
        {blog.comments.length === 0 ? (
          <Text size="2" color="gray" className="italic">No comments yet.</Text>
        ) : (
          [...blog.comments]
            .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
            .slice(0, 3)
            .map((comment, idx, arr) => (
              <React.Fragment key={comment.id}>
                <Box className="mb-2">
                  <Text weight="bold" size="2">{comment.user.name}</Text>
                  <Text size="2" className="block mb-1">
                    {new Date(comment.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </Text>
                  <Text size="2">{comment.content}</Text>
                </Box>
                {idx < arr.length - 1 && <Box asChild><hr className="my-2 border-[var(--plum-6)]" /></Box>}
              </React.Fragment>
            ))
        )}
      </Box>
    </Container>
  );
};

export default BlogDetailPage;

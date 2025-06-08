import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Separator,
  Text,
} from "@radix-ui/themes";
import prisma from "@/prisma/client";
import { FaRegCommentDots, FaRegEye, FaRegHeart } from "react-icons/fa";
import Link from "next/link";
import React from "react";

interface Blog {
  id: string;
  views: { createdAt: Date; userId: string; blogId: string }[];
  likes: { createdAt: Date; userId: string; blogId: string }[];
  comments: { id: string; content: string; createdAt: Date; updatedAt: Date; userId: string; blogId: string }[];
}

interface Props {
  params: { id: string };
}

export default async function ProfileIdPage({ params }: Props) {
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      blogs: {
        where: { isPublished: true },
        include: {
          likes: true,
          views: true,
          comments: true,
        },
      },
    },
  });

  if (!user) {
    return (
      <Container>
        <Text size="6" weight="bold">
          User not found
        </Text>
      </Container>
    );
  }

  const publishedBlogs = user.blogs;
  const totalPublished = publishedBlogs.length;
  const totalViews = publishedBlogs.reduce(
    (acc: number, blog: Blog) => acc + blog.views.length,
    0
  );
  const totalLikes = publishedBlogs.reduce(
    (acc: number, blog: Blog) => acc + blog.likes.length,
    0
  );
  const totalComments = publishedBlogs.reduce(
    (acc: number, blog: Blog) => acc + blog.comments.length,
    0
  );

  return (
    <Container size="3" className="py-8">
      <Flex direction="column" align="center" gap="4">
        <Avatar
          src={user.image || undefined}
          fallback={user.name?.[0] || "U"}
          size="6"
          radius="full"
          className="mb-2"
        />
        <Text size="7" weight="bold" className="heading-font">
          {user.name}
        </Text>
        <Text>{user.email}</Text>
      </Flex>
      <Flex justify="center" gap="8" className="my-8">
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalPublished}
          </Text>
          <Text color="purple">Total Published Post</Text>
        </Flex>
        <Separator orientation="vertical" size="2" />
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalViews}
          </Text>
          <Text color="purple">Total Post Views</Text>
        </Flex>
        <Separator orientation="vertical" size="2" />
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalLikes}
          </Text>
          <Text color="purple">Total Post Likes</Text>
        </Flex>
        <Separator orientation="vertical" size="2" />
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalComments}
          </Text>
          <Text color="purple">Total Post Comments</Text>
        </Flex>
      </Flex>
      {publishedBlogs.length === 0 ? (
        <Flex align="center" justify="center" className="min-h-[200px]">
          <Text color="purple" size="4" weight="bold">
            No published posts yet.
          </Text>
        </Flex>
      ) : (
        <Grid columns={{ initial: "1", md: "3" }} gap="5">
          {publishedBlogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blogs/${blog.id}`}
              style={{ textDecoration: "none" }}
            >
              <Box className="bg-[var(--purple-1)] rounded-lg p-4 shadow hover:bg-[var(--purple-2)] transition-colors cursor-pointer">
                <Flex align="center" justify="center" className="mb-4">
                  <Flex
                    align="center"
                    justify="center"
                    className="w-full aspect-square max-h-48 bg-[var(--purple-4)] rounded-md flex items-center justify-center"
                  >
                    <Text size="8" weight="bold" color="purple">
                      {blog.title[0] || "B"}
                    </Text>
                  </Flex>
                </Flex>
                <Text as="div" weight="bold" size="4" mb="2">
                  {blog.title}
                </Text>
                <Flex align="center" gap="3" mb="2">
                  <Avatar
                    src={user.image || undefined}
                    fallback={user.name?.[0] || "U"}
                    size="3"
                    radius="full"
                    className="bg-[var(--purple-4)] text-[var(--purple-11)]"
                  />
                  <Box>
                    <Text weight="bold">{user.name}</Text>
                    <Text color="purple" size="1" as="div">
                      {blog.createdAt.toLocaleDateString()}{" "}
                      {blog.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                </Flex>
                <Flex gap="4" mt="2" align="center">
                  <Flex align="center" gap="1">
                    <FaRegCommentDots />
                    <Text size="1">{blog.comments.length}</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <FaRegHeart />
                    <Text size="1">{blog.likes.length}</Text>
                  </Flex>
                  <Flex align="center" gap="1">
                    <FaRegEye />
                    <Text size="1">{blog.views.length} Views</Text>
                  </Flex>
                </Flex>
              </Box>
            </Link>
          ))}
        </Grid>
      )}
    </Container>
  );
}

// app/blogs/[id]/page.tsx
import prisma from "@/prisma/client";
import { notFound } from "next/navigation";
import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Avatar, Box, Container, Flex, Text } from "@radix-ui/themes";

interface Props {
  params: { id: string };
}

const BlogDetails = async ({ params }: Props) => {
  const { id } = params;
  const blog = await prisma.blogEntry.findUnique({
    where: {
      blogId: id,
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
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
    return notFound();
  }

  return (
    <Container size="4" className="py-8">
      <Box className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <Box className="p-6 sm:p-8">
          <Flex direction="column" gap="4">
            <Flex direction="column" gap="2">
              <Text size="8" weight="bold" className="text-gray-900">
                {blog.title}
              </Text>
              <Flex align="center" gap="2" className="text-gray-500">
                <Avatar
                  src={blog.author.image}
                  fallback={blog.author.name[0]}
                  size="2"
                  radius="full"
                />
                <Text size="2">{blog.author.name}</Text>
                <Text size="2">•</Text>
                <Text size="2">
                  {formatDistanceToNow(blog.createdAt, { addSuffix: true })}
                </Text>
              </Flex>
            </Flex>

            <Box className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: blog.content }} />
            </Box>

            <Box className="mt-8">
              <Text size="5" weight="bold" className="mb-4">
                Comments ({blog.comments.length})
              </Text>
              <Flex direction="column" gap="4">
                {blog.comments.map((comment) => (
                  <Box
                    key={comment.commentId}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <Flex gap="3">
                      <Avatar
                        src={comment.user.image}
                        fallback={comment.user.name[0]}
                        size="2"
                        radius="full"
                      />
                      <Flex direction="column" gap="1" className="flex-1">
                        <Flex align="center" gap="2">
                          <Text size="2" weight="bold">
                            {comment.user.name}
                          </Text>
                          <Text size="1" className="text-gray-500">
                            {formatDistanceToNow(comment.createdAt, {
                              addSuffix: true,
                            })}
                          </Text>
                        </Flex>
                        <Text size="2">{comment.content}</Text>
                      </Flex>
                    </Flex>
                  </Box>
                ))}
              </Flex>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Container>
  );
};

export default BlogDetails;

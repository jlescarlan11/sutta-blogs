"use client";

import prisma from "@/prisma/client";
import { Box, Container, Flex, Text, Avatar, Tabs, TextField, Button } from "@radix-ui/themes";
import { formatDistanceToNow } from "date-fns";
import { notFound } from "next/navigation";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

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
  likes: { userId: string; commentId: string }[];
}

interface Blog {
  id: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  comments: Comment[];
}

const CommentsPage = ({ blog }: { blog: Blog }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const topComments = [...blog.comments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const allComments = [...blog.comments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !session) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/blogs/${blog.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: comment }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      setComment("");
      router.refresh();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <Box className="space-y-4">
        <Text size="8" weight="bold">
          Comments
        </Text>

        {session ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <Flex direction="column" gap="2">
              <TextField.Root>
                <TextField.Slot>
                  <input
                    placeholder="Write a comment..."
                    value={comment}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComment(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full px-3 py-2 border rounded"
                  />
                </TextField.Slot>
              </TextField.Root>
              <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </Flex>
          </form>
        ) : (
          <Text size="2" color="gray">Please sign in to leave a comment.</Text>
        )}

        <Tabs.Root defaultValue="top">
          <Tabs.List>
            <Tabs.Trigger value="top">Top Comments</Tabs.Trigger>
            <Tabs.Trigger value="all">All Comments</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="top">
            {topComments.length === 0 && <Text>No comments yet.</Text>}
            {topComments.map((comment) => (
              <Box key={comment.id} className="mb-4 p-4 border rounded">
                <Flex gap="2" align="center" mb="2">
                  <Avatar
                    src={comment.user.image || ""}
                    fallback={comment.user.name[0]}
                    size="1"
                  />
                  <Text size="2">
                    {comment.user.name} • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Text>
                </Flex>
                <Text size="2">{comment.content}</Text>
              </Box>
            ))}
          </Tabs.Content>
          <Tabs.Content value="all">
            {allComments.length === 0 && <Text>No comments yet.</Text>}
            {allComments.map((comment) => (
              <Box key={comment.id} className="mb-4 p-4 border rounded">
                <Flex gap="2" align="center" mb="2">
                  <Avatar
                    src={comment.user.image || ""}
                    fallback={comment.user.name[0]}
                    size="1"
                  />
                  <Text size="2">
                    {comment.user.name} • {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                  </Text>
                </Flex>
                <Text size="2">{comment.content}</Text>
              </Box>
            ))}
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

// Create a server component wrapper to fetch the data
const CommentsPageWrapper = async ({ params }: Props) => {
  const blog = (await prisma.blogEntry.findUnique({
    where: { id: params.id },
    include: {
      comments: {
        include: {
          user: true,
        },
      },
    },
  })) as Blog | null;

  if (!blog) notFound();

  return <CommentsPage blog={blog} />;
};

export default CommentsPageWrapper; 
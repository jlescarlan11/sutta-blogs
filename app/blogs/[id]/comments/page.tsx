"use client";

import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  params: Promise<{ id: string }>;
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
  _count?: {
    likes: number;
  };
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

// Create a server component wrapper to fetch the data
const CommentsPageWrapper = ({ params }: Props) => {
  const resolvedParams = React.use(params);
  return <CommentsPage blogId={resolvedParams.id} />;
};

// Client component
const CommentsPage = ({ blogId }: { blogId: string }) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { status, data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${blogId}`);
        setBlog(response.data);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          router.push("/404");
          return;
        }
        console.error("Error fetching blog:", error);
        setError("Failed to load blog data");
      }
    };

    fetchBlog();
  }, [blogId, router]);

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (!blog) {
    return <Text>Loading...</Text>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`/api/blogs/${blog.id}/comments`, { content: comment });
      setComment("");
      // Fetch updated blog data
      const response = await axios.get(`/api/blogs/${blogId}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditContent("");
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.put(`/api/blogs/${blogId}/comments`, {
        commentId,
        content: editContent,
      });
      const response = await axios.get(`/api/blogs/${blogId}`);
      setBlog(response.data);
      setEditingComment(null);
      setEditContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setIsSubmitting(true);
    try {
      await axios.delete(
        `/api/blogs/${blogId}/comments?commentId=${commentId}`
      );
      const response = await axios.get(`/api/blogs/${blogId}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.patch(
        `/api/blogs/${blogId}/comments?commentId=${commentId}`
      );
      const updatedComment = response.data;

      // Update the blog state with the updated comment
      setBlog((prevBlog) => {
        if (!prevBlog) return prevBlog;
        return {
          ...prevBlog,
          comments: prevBlog.comments.map((comment) =>
            comment.id === commentId ? updatedComment : comment
          ),
        };
      });
    } catch (error) {
      console.error("Error liking comment:", error);
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

        {status === "authenticated" ? (
          <form onSubmit={handleSubmit} className="mb-6">
            <Flex direction="column" gap="2">
              <TextField.Root
                placeholder="Write a comment..."
                size="3"
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setComment(e.target.value)
                }
                disabled={isSubmitting}
              ></TextField.Root>
              <Button
                type="submit"
                disabled={isSubmitting || !comment.trim()}
                size="3"
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </Flex>
          </form>
        ) : (
          <Text size="2" color="purple">
            Please sign in to leave a comment.
          </Text>
        )}

        {!blog.comments || blog.comments.length === 0 ? (
          <Text size="2" color="purple" className="italic">
            No comments yet.
          </Text>
        ) : (
          [...blog.comments]
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((comment, idx, arr) => (
              <React.Fragment key={comment.id}>
                <Box className="mb-2">
                  <Flex
                    gap="2"
                    wrap="wrap"
                    align="center"
                    justify="between"
                    mb="4"
                  >
                    <Flex gap="2" align="center">
                      <Avatar
                        src={comment.user.image || ""}
                        fallback={comment.user.name[0]}
                        size="1"
                      />
                      <Text weight="bold" size="2">
                        {comment.user.name}
                      </Text>
                      <Text size="2" color="purple">
                        {new Date(comment.createdAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </Text>
                    </Flex>
                    {session?.user?.id === comment.userId && (
                      <Flex gap="2">
                        <Button
                          size="3"
                          variant="soft"
                          color="purple"
                          onClick={() => handleEdit(comment)}
                          disabled={isSubmitting}
                        >
                          Edit
                        </Button>
                        <Button
                          size="3"
                          variant="soft"
                          color="red"
                          onClick={() => handleDeleteComment(comment.id)}
                          disabled={isSubmitting}
                        >
                          Delete
                        </Button>
                      </Flex>
                    )}
                  </Flex>
                  {editingComment === comment.id ? (
                    <Flex direction="column" gap="2" mt="2">
                      <TextField.Root
                        size="3"
                        value={editContent}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setEditContent(e.target.value)
                        }
                        disabled={isSubmitting}
                      ></TextField.Root>
                      <Flex gap="2">
                        <Button
                          size="3"
                          onClick={() => handleUpdateComment(comment.id)}
                          disabled={isSubmitting || !editContent.trim()}
                        >
                          Save
                        </Button>
                        <Button
                          size="3"
                          variant="soft"
                          color="purple"
                          onClick={handleCancelEdit}
                          disabled={isSubmitting}
                        >
                          Cancel
                        </Button>
                      </Flex>
                    </Flex>
                  ) : (
                    <Text size="2" className="block mt-1">
                      {comment.content}
                    </Text>
                  )}
                  <Flex gap="1" align="center" mt="1">
                    {(() => {
                      const hasLiked = comment.likes?.some(
                        (like) => like.userId === session?.user?.id
                      );
                      return (
                        <Button
                          size="3"
                          variant="ghost"
                          color={hasLiked ? "red" : "purple"}
                          onClick={() => handleLikeComment(comment.id)}
                          disabled={isSubmitting || !session}
                          className="flex items-center gap-1"
                        >
                          {hasLiked ? (
                            <HeartFilledIcon width="16" height="16" />
                          ) : (
                            <HeartIcon width="16" height="16" />
                          )}
                          <Text size="2" color={hasLiked ? "red" : "purple"}>
                            {comment._count?.likes || 0}
                          </Text>
                        </Button>
                      );
                    })()}
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
    </Container>
  );
};

export default CommentsPageWrapper;

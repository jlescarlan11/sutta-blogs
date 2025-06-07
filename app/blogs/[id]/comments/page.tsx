"use client";

import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Tabs,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";

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

  const topComments = [...blog.comments]
    .sort((a, b) => (b.likes?.length ?? 0) - (a.likes?.length ?? 0))
    .slice(0, 3);
  const allComments = [...blog.comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !session) return;

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
      await axios.delete(`/api/blogs/${blogId}/comments?commentId=${commentId}`);
      const response = await axios.get(`/api/blogs/${blogId}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    if (!session) return;

    setIsSubmitting(true);
    try {
      const response = await axios.patch(`/api/blogs/${blogId}/comments?commentId=${commentId}`);
      const updatedComment = response.data;
      
      // Update the blog state with the updated comment
      setBlog(prevBlog => {
        if (!prevBlog) return prevBlog;
        return {
          ...prevBlog,
          comments: prevBlog.comments.map(comment => 
            comment.id === commentId ? updatedComment : comment
          )
        };
      });
    } catch (error) {
      console.error("Error liking comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderComment = (comment: Comment) => {
    const isOwner = session?.user?.id === comment.userId;
    const isEditing = editingComment === comment.id;
    const hasLiked = comment.likes?.some(like => like.userId === session?.user?.id) ?? false;
    const likeCount = comment.likes?.length ?? 0;

    console.log('Comment ID:', comment.id, 'Has Liked:', hasLiked, 'Likes:', comment.likes);

    return (
      <Box key={comment.id} className="mb-4 p-4 border rounded">
        <Flex gap="2" align="center" mb="2" justify="between">
          <Flex gap="2" align="center">
            <Avatar
              src={comment.user.image || ""}
              fallback={comment.user.name[0]}
              size="1"
            />
            <Text size="2">
              {comment.user.name} •{" "}
              {formatDistanceToNow(new Date(comment.createdAt), {
                addSuffix: true,
              })}
            </Text>
          </Flex>
          <Flex gap="2" align="center">
            <Button
              variant="soft"
              color={hasLiked ? "red" : "gray"}
              onClick={() => handleLikeComment(comment.id)}
              disabled={isSubmitting}
              className="flex items-center gap-1"
            >
              {hasLiked ? (
                <HeartFilledIcon width="16" height="16" />
              ) : (
                <HeartIcon width="16" height="16" />
              )}
              {likeCount > 0 && <span>{likeCount}</span>}
            </Button>
            {isOwner && !isEditing && (
              <>
                <Button
                  variant="soft"
                  color="gray"
                  onClick={() => handleEdit(comment)}
                  disabled={isSubmitting}
                >
                  Edit
                </Button>
                <Button
                  variant="soft"
                  color="red"
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={isSubmitting}
                >
                  Delete
                </Button>
              </>
            )}
          </Flex>
        </Flex>
        {isEditing ? (
          <Flex direction="column" gap="2">
            <TextField.Root>
              <TextField.Slot>
                <input
                  value={editContent}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditContent(e.target.value)}
                  disabled={isSubmitting}
                />
              </TextField.Slot>
            </TextField.Root>
            <Flex gap="2">
              <Button
                onClick={() => handleUpdateComment(comment.id)}
                disabled={isSubmitting || !editContent.trim()}
              >
                Save
              </Button>
              <Button
                variant="soft"
                color="gray"
                onClick={handleCancelEdit}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </Flex>
          </Flex>
        ) : (
          <Text size="2">{comment.content}</Text>
        )}
      </Box>
    );
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
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setComment(e.target.value)
                }
                disabled={isSubmitting}
              ></TextField.Root>
              <Button type="submit" disabled={isSubmitting || !comment.trim()}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </Flex>
          </form>
        ) : (
          <Text size="2" color="gray">
            Please sign in to leave a comment.
          </Text>
        )}

        <Tabs.Root defaultValue="top">
          <Tabs.List>
            <Tabs.Trigger value="top">Top Comments</Tabs.Trigger>
            <Tabs.Trigger value="all">All Comments</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="top">
            {topComments.length === 0 && <Text>No comments yet.</Text>}
            {topComments.map(renderComment)}
          </Tabs.Content>
          <Tabs.Content value="all">
            {allComments.length === 0 && <Text>No comments yet.</Text>}
            {allComments.map(renderComment)}
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default CommentsPageWrapper;

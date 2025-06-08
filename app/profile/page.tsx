import prisma from "@/prisma/client";
import {
  Avatar,
  Box,
  Container,
  Flex,
  Grid,
  Separator,
  Text,
} from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaRegCommentDots, FaRegEye, FaRegHeart } from "react-icons/fa";
import authOptions from "../auth/authOptions";
import ShareProfileButton from "./ShareProfileButton";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return (
      <Container>
        <Text size="6" weight="bold">
          Not authenticated
        </Text>
      </Container>
    );
  }

  // Fetch user and published blogs
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
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

  // Redirect to /profile/[id] if not already there
  if (typeof window === "undefined") {
    // On server, check if path is /profile, then redirect
    // (This logic is for SSR, but Next.js doesn't provide req.path here, so skip for now)
  }

  // Stats for published posts only
  const publishedBlogs = user.blogs;
  const totalPublished = publishedBlogs.length;
  const totalViews = publishedBlogs.reduce(
    (acc: number, blog: { views: { length: number } }) =>
      acc + blog.views.length,
    0
  );
  const totalLikes = publishedBlogs.reduce(
    (acc: number, blog: { likes: { length: number } }) =>
      acc + blog.likes.length,
    0
  );
  const totalComments = publishedBlogs.reduce(
    (acc: number, blog: { comments: { length: number } }) =>
      acc + blog.comments.length,
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
        <ShareProfileButton userId={user.id} />
      </Flex>
      <Flex justify="center" gap="4" className="my-8">
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalPublished}
          </Text>
          <Text className="text-xs sm:text-base" color="purple" align="center">
            Published Post
          </Text>
        </Flex>
        <Separator orientation="vertical" size="2" />
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalViews}
          </Text>
          <Text className="text-xs sm:text-base" color="purple" align="center">
            Total Views
          </Text>
        </Flex>
        <Separator orientation="vertical" size="2" />
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalLikes}
          </Text>
          <Text className="text-xs sm:text-base" color="purple" align="center">
            Total Likes
          </Text>
        </Flex>
        <Separator orientation="vertical" size="2" />
        <Flex direction="column" align="center">
          <Text size="6" weight="bold">
            {totalComments}
          </Text>
          <Text className="text-xs sm:text-base" color="purple" align="center">
            Total Comments
          </Text>
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

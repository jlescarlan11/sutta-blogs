import prisma from "@/prisma/client";
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Text,
} from "@radix-ui/themes";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaRegCommentDots, FaRegEye, FaRegHeart } from "react-icons/fa";
import authOptions from "./auth/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Fetch all published blogs, earliest to oldest, with author and stats
  const blogs = await prisma.blogEntry.findMany({
    where: { isPublished: true },
    include: {
      author: true,
      likes: true,
      views: true,
      comments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <Container size="3" className="py-8">
      <Flex justify="between" align="center" mb="6">
        <Text size="5" weight="bold">
          Explore latest blog posts and articles
        </Text>
        <Link href={session ? "/blogs/new" : "/api/auth/signin"}>
          <Button variant="soft" size="3">
            Create Blog
          </Button>
        </Link>
      </Flex>
      {blogs.length === 0 ? (
        <Flex align="center" justify="center" className="min-h-[200px]">
          <Text color="purple" size="4" weight="bold">
            No published posts yet.
          </Text>
        </Flex>
      ) : (
        <Grid columns={{ initial: "1", md: "3" }} gap="5">
          {blogs.map((blog) => (
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
                    src={blog.author?.image || undefined}
                    fallback={blog.author?.name?.[0] || "U"}
                    size="3"
                    radius="full"
                    className="bg-[var(--purple-4)] text-[var(--purple-11)]"
                  />
                  <Box>
                    <Text weight="bold">{blog.author?.name || "Unknown"}</Text>
                    <Text color="purple" size="1" as="div">
                      {new Date(blog.createdAt).toLocaleDateString()}{" "}
                      {new Date(blog.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </Box>
                </Flex>
                <Flex
                  gap="4"
                  mt="2"
                  align="center"
                  className="text-[var(--purple-11)]"
                >
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

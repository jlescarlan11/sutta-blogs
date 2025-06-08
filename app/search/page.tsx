import prisma from "@/prisma/client";
import { Avatar, Box, Container, Flex, Grid, Text } from "@radix-ui/themes";
import Link from "next/link";
import { FaRegCommentDots, FaRegEye, FaRegHeart } from "react-icons/fa";
import { notFound } from "next/navigation";

interface Props {
  searchParams: Promise<{ q: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q;

  if (!query) {
    notFound();
  }

  const blogs = await prisma.blogEntry.findMany({
    where: {
      AND: [
        { isPublished: true },
        {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
      ],
    },
    include: {
      author: true,
      comments: true,
      likes: true,
      views: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <Container size="3" className="py-8">
      <Flex direction="column" gap="6">
        <Box>
          <Text size="6" weight="bold" className="mb-2">
            Search Results
          </Text>
          <Text color="purple">
            Found {blogs.length} results for &quot;{query}&quot;
          </Text>
        </Box>

        {blogs.length === 0 ? (
          <Flex align="center" justify="center" className="min-h-[200px]">
            <Text color="purple" size="4" weight="bold">
              No blogs found matching your search.
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
                      <Text weight="bold">
                        {blog.author?.name || "Unknown"}
                      </Text>
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
      </Flex>
    </Container>
  );
}

"use client";
import { createBlogSchema } from "@/app/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Badge,
  Box,
  Button,
  Callout,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuEye, LuInfo, LuSave } from "react-icons/lu";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type BlogFormData = z.infer<typeof createBlogSchema>;

const NewBlogPage = () => {
  const router = useRouter();
  const [isDraft, setIsDraft] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<BlogFormData>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      content: "",
      isPublished: false,
    },
  });

  const content = watch("content");
  const title = watch("title");

  const wordCount = content
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word.length > 0).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      const now = new Date();
      await axios.post("/api/blogs", {
        ...data,
        isPublished: !isDraft,
        readTime,
        createdAt: now,
        updatedAt: now,
      });
      router.push("/blogs");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  });

  const handleSaveDraft = () => {
    setIsDraft(true);
    setValue("isPublished", false);
    onSubmit();
  };

  const handlePublish = () => {
    setIsDraft(false);
    setValue("isPublished", true);
    onSubmit();
  };

  return (
    <Box className="min-h-screen">
      <Container size="4" className="">
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="6">
            <Box>
              <Flex justify="between" align="center" wrap="wrap" gap="4">
                <Flex direction="column" gap="2">
                  <Flex align="center" gap="2" className="text-sm ">
                    <Link
                      href="/"
                      className="hover:underline flex items-center gap-1"
                    >
                      <Text>Dashboard</Text>
                    </Link>
                    <span>/</span>
                    <Link href="/blogs" className="hover:underline ">
                      <Text>Blogs</Text>
                    </Link>
                    <span>/</span>
                    <Text className="text-[var(--plum-8)]">New Blog</Text>
                  </Flex>
                  <Flex direction="column" gap="2">
                    <Flex align="center" gap="2" className="mt-4">
                      <Text size="6" weight="bold">
                        Create New Blog
                      </Text>

                      <Badge
                        color={isDraft ? "orange" : "green"}
                        variant="soft"
                      >
                        {isDraft ? "Draft" : "Ready to Publish"}
                      </Badge>
                    </Flex>
                    <Text>Create new blog and share it to people.</Text>
                  </Flex>
                </Flex>
              </Flex>
            </Box>

            <Box className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Box className="p-6 sm:p-8">
                <Flex direction="column" gap="4">
                  <Box>
                    <Flex direction="column" gap="4">
                      <Text size="2" weight="medium" className=" block">
                        Blog Title
                      </Text>
                      <TextField.Root
                        size="3"
                        placeholder="Enter your blog title..."
                        {...register("title")}
                        className="text-lg"
                      />
                      {errors.title && (
                        <Text color="red" size="1">
                          {errors.title.message}
                        </Text>
                      )}
                    </Flex>
                  </Box>

                  <Box>
                    <Flex justify="between" align="center" mb="3">
                      <Text size="2" weight="medium">
                        Content
                      </Text>
                      <Flex align="center" gap="4" className="text-sm">
                        <Text>{readTime} min read</Text>
                      </Flex>
                    </Flex>

                    <Callout.Root size="1" className="mb-4" variant="soft">
                      <Flex align="center" gap="2">
                        <Callout.Icon>
                          <LuInfo />
                        </Callout.Icon>
                        <Callout.Text size="1">
                          New to Markdown? Check out the{" "}
                          <a
                            href="https://www.markdownguide.org/basic-syntax/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline font-medium"
                          >
                            syntax guide
                          </a>
                          .
                        </Callout.Text>
                      </Flex>
                    </Callout.Root>

                    <Box className="border border-gray-200 rounded-lg overflow-hidden">
                      <Controller
                        name="content"
                        control={control}
                        render={({ field }) => (
                          <SimpleMDE
                            placeholder="Enter your blog content..."
                            {...field}
                          />
                        )}
                      />
                      {errors.content && (
                        <Text color="red" size="1">
                          {errors.content.message}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Flex>
              </Box>

              <Box className="border-t border-gray-200 bg-gray-50 px-6 py-4 sm:px-8">
                {error && (
                  <Callout.Root color="red" className="mb-4">
                    <Callout.Text>{error}</Callout.Text>
                  </Callout.Root>
                )}
                <Flex justify="between" align="center" gap="4" wrap="wrap">
                  <Flex align="center" gap="4">
                    <Button
                      type="button"
                      variant="soft"
                      color="gray"
                      onClick={() => setIsDraft(!isDraft)}
                      className="flex items-center gap-2"
                    >
                      <LuEye size={16} />
                      {isDraft ? "Mark as Ready" : "Mark as Draft"}
                    </Button>
                  </Flex>

                  <Flex align="center" gap="3">
                    <Button
                      type="button"
                      variant="soft"
                      onClick={handleSaveDraft}
                      disabled={
                        isSubmitting || (!title.trim() && !content.trim())
                      }
                      className="flex items-center gap-2"
                    >
                      <LuSave size={16} />
                      Save Draft
                    </Button>

                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={
                        isSubmitting ||
                        !title.trim() ||
                        !content.trim() ||
                        isDraft
                      }
                      className="flex items-center gap-2 min-w-[120px]"
                    >
                      {isSubmitting ? "Publishing..." : "Publish Blog"}
                    </Button>
                  </Flex>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </form>
      </Container>
    </Box>
  );
};

export default NewBlogPage;

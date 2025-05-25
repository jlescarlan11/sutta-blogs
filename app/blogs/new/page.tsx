"use client";
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
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuEye, LuInfo, LuSave } from "react-icons/lu";
import { z } from "zod";
import dynamic from "next/dynamic";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

const createBlogSchema = z.object({
  title: z.string().min(1).max(55),
  content: z.string().min(1),
  published: z.boolean(),
});

type BlogFormData = z.infer<typeof createBlogSchema>;

const NewBlogPage = () => {
  const router = useRouter();
  const [isDraft, setIsDraft] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const delay = 1000;
  const [contentValue, setContentValue] = useState("");

  useEffect(() => {
    setIsClient(true);
    setContentValue(localStorage.getItem("autosaved_blog_content") || "");
  }, []);

  const anOptions = useMemo(() => {
    return {
      autosave: {
        enabled: true,
        uniqueId: "autosaved_blog_content",
        delay,
        submit_delay: delay,
      },
      spellChecker: false,
    };
  }, [delay]);

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
      published: false,
    },
  });

  useEffect(() => {
    setValue("published", !isDraft);
  }, [isDraft, setValue]);

  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      const currentContent = watch("content");
      if (currentContent) {
        localStorage.setItem("autosaved_blog_content", currentContent);
      }
    }, delay);
    return () => clearInterval(interval);
  }, [watch, delay, isClient]);

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
      await axios.post("/api/blogs", {
        ...data,
        published: !isDraft,
        readTime,
      });
      if (isClient) {
        localStorage.removeItem("autosaved_blog_content");
      }
      router.push("/blogs");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  });

  if (!isClient) {
    return (
      <Container
        size="4"
        className="min-h-screen flex items-center justify-center"
      >
        <Text>Loading editor...</Text>
      </Container>
    );
  }

  return (
    <Box className="min-h-screen">
      <Container size="4" className="">
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="6">
            <Box>
              <Flex justify="between" align="center" wrap="wrap" gap="4">
                <Flex direction="column" gap="2">
                  <Flex
                    align="center"
                    gap="2"
                    className="text-sm text-gray-600"
                  >
                    <Link
                      href="/"
                      className="hover:underline text-gray-600 flex items-center gap-1"
                    >
                      Dashboard
                    </Link>
                    <span>/</span>
                    <Link
                      href="/blogs"
                      className="hover:underline text-gray-600"
                    >
                      Blogs
                    </Link>
                    <span>/</span>
                    <Text className="text-gray-400">New Blog</Text>
                  </Flex>
                  <Flex align="center" gap="3" className="mt-4">
                    <Text size="6" weight="bold">
                      Create New Blog
                    </Text>
                    <Badge color={isDraft ? "orange" : "green"} variant="soft">
                      {isDraft ? "Draft" : "Ready to Publish"}
                    </Badge>
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
                            value={contentValue}
                            onChange={(val) => {
                              setContentValue(val);
                              field.onChange(val);
                            }}
                            options={anOptions}
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
                      variant="soft"
                      onClick={() => {
                        setIsDraft(true);
                        handleSubmit((data) => {
                          onSubmit({ ...data, published: false });
                        })();
                      }}
                      disabled={
                        isSubmitting || (!title.trim() && !content.trim())
                      }
                      className="flex items-center gap-2"
                    >
                      <LuSave size={16} />
                      Save Draft
                    </Button>

                    <Button
                      type="submit"
                      onClick={() => {
                        setIsDraft(false);
                      }}
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

      <style jsx global>{`
        .blog-editor .CodeMirror {
          border: none;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Consolas,
            "Liberation Mono", Menlo, monospace;
          font-size: 14px;
          line-height: 1.6;
        }

        .blog-editor .editor-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          background: var(--plum-3);
        }

        .blog-editor .editor-toolbar button {
          color: var(--plum-11);
        }

        .blog-editor .editor-toolbar button:hover {
          color: var(--plum-12);
          background: var(--plum-3);
        }

        .blog-editor .editor-statusbar {
          color: #9ca3af;
          font-size: 12px;
        }
      `}</style>
    </Box>
  );
};

export default NewBlogPage;

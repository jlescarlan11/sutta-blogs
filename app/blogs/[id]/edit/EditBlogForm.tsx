"use client";
import { createBlogSchema } from "@/app/ValidationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Callout,
  Checkbox,
  Container,
  Flex,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuInfo } from "react-icons/lu";
import { z } from "zod";
import Header from "../../new/Header";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type BlogFormData = z.infer<typeof createBlogSchema>;

interface Props {
  id: string;
}

const EditBlogForm = ({ id }: Props) => {
  const router = useRouter();
  const [isDraft, setIsDraft] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blogs/${id}`);
        const blog = response.data;
        setValue("title", blog.title);
        setValue("content", blog.content);
        setIsDraft(!blog.isPublished);
        setValue("isPublished", blog.isPublished);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        setError("Failed to load blog data");
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id, setValue]);

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
      await axios.patch(`/api/blogs/${id}`, {
        ...data,
        isPublished: !isDraft,
        readTime,
        updatedAt: new Date(),
      });
      router.push("/blogs");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  });

  if (isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center">
        <Text>Loading...</Text>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen">
      <Container size="4" className="">
        <form onSubmit={onSubmit}>
          <Flex direction="column" gap="6">
            <Box>
              <Header />
            </Box>

            <Box className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <Box className="p-6 sm:p-8">
                <Flex direction="column" gap="4">
                  <Box>
                    <Flex direction="column" gap="4">
                      <Text size="2" weight="medium" className="block">
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
                  <Flex align="center" gap="2">
                    <Checkbox
                      id="publish-post"
                      checked={!isDraft}
                      onCheckedChange={(checked: boolean) => {
                        setIsDraft(!checked);
                        setValue("isPublished", checked);
                      }}
                      variant="soft"
                    />
                    <label htmlFor="publish-post">Publish Post</label>
                  </Flex>

                  <Button
                    type="submit"
                    disabled={isSubmitting || !title.trim() || !content.trim()}
                    variant="soft"
                    size="3"
                    className="min-w-[120px] px-8 py-2"
                  >
                    {isSubmitting ? "Saving..." : "Save Changes"}
                  </Button>
                </Flex>
              </Box>
            </Box>
          </Flex>
        </form>
      </Container>
    </Box>
  );
};

export default EditBlogForm; 
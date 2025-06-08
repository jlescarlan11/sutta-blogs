// app/blogs/BlogsTable.tsx (new client component)
"use client";

import { Blog } from "@/types";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Select,
  Table,
  Text,
  TextField,
} from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEdit, FaExchangeAlt, FaEye, FaTrash } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

interface Props {
  blogs: Blog[];
}

const BlogTable = ({ blogs }: Props) => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [loading, setLoading] = useState(false);
  const [publishLoadingStates, setPublishLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [deleteLoadingStates, setDeleteLoadingStates] = useState<{
    [key: string]: boolean;
  }>({});
  const router = useRouter();

  const toggleBlogSelection = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id) ? prev.filter((blogId) => blogId !== id) : [...prev, id]
    );
  };

  const selectAllBlogs = () => {
    setSelectedBlogs(blogs.map((blog) => blog.id));
  };

  const deselectAllBlogs = () => {
    setSelectedBlogs([]);
  };

  const deleteBlog = async (id: string) => {
    setDeleteLoadingStates((prev) => ({ ...prev, [id]: true }));
    try {
      await axios.delete(`/api/blogs/${id}`);
      router.refresh();
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setDeleteLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const deleteSelectedBlogs = async () => {
    setLoading(true);
    try {
      await Promise.all(
        selectedBlogs.map((id) => axios.delete(`/api/blogs/${id}`))
      );
      router.refresh();
      setSelectedBlogs([]);
    } catch (error) {
      console.error("Error deleting selected blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async (blog: Blog) => {
    setPublishLoadingStates((prev) => ({ ...prev, [blog.id]: true }));
    try {
      await axios.patch(`/api/blogs/${blog.id}`, {
        isPublished: !blog.isPublished,
      });
      router.refresh();
    } catch (error) {
      console.error("Error toggling publish:", error);
    } finally {
      setPublishLoadingStates((prev) => ({ ...prev, [blog.id]: false }));
    }
  };

  // Filter and search
  const filteredBlogs = blogs
    .filter((blog) => {
      const matchesSearch = blog.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        status === "all" ||
        (status === "published" && blog.isPublished) ||
        (status === "draft" && !blog.isPublished);
      return matchesSearch && matchesStatus;
    })
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  return (
    <Box>
      <Flex gap="4" mb="8">
        <TextField.Root
          placeholder="Search Posts..."
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearch(e.target.value)
          }
          variant="soft"
          size="3"
        >
          <TextField.Slot>
            <LuSearch />
          </TextField.Slot>
        </TextField.Root>

        <Select.Root value={status} onValueChange={setStatus} size="3">
          <Select.Trigger variant="soft" color="purple" />
          <Select.Content>
            <Select.Item value="all">Status</Select.Item>
            <Select.Item value="published">Published</Select.Item>
            <Select.Item value="draft">Draft</Select.Item>
          </Select.Content>
        </Select.Root>

        <Button
          variant="soft"
          size="3"
          onClick={() => router.push("/blogs/new")}
        >
          Create Blog
        </Button>

        {selectedBlogs.length > 0 && (
          <Button
            color="red"
            variant="soft"
            onClick={deleteSelectedBlogs}
            disabled={loading}
            size="3"
          >
            {loading ? (
              <Flex align="center" gap="2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <Text>Deleting...</Text>
              </Flex>
            ) : (
              <Flex align="center" gap="2">
                <FaTrash />
                <Text>Delete Selected ({selectedBlogs.length})</Text>
              </Flex>
            )}
          </Button>
        )}
      </Flex>

      <Box className="w-full overflow-x-auto">
        <Table.Root size="3" variant="surface" layout="auto" className="w-full">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell style={{ width: "60px" }}>
                <Checkbox
                  checked={
                    selectedBlogs.length === blogs.length && blogs.length > 0
                  }
                  onCheckedChange={() =>
                    selectedBlogs.length === blogs.length
                      ? deselectAllBlogs()
                      : selectAllBlogs()
                  }
                />
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: "45%" }}>
                Title
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: "15%" }}>
                Date
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: "15%" }}>
                Status
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell style={{ width: "15%" }}>
                Action
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {filteredBlogs.map((blog) => (
              <Table.Row key={blog.id}>
                <Table.Cell>
                  <Checkbox
                    checked={selectedBlogs.includes(blog.id)}
                    onCheckedChange={() => toggleBlogSelection(blog.id)}
                  />
                </Table.Cell>
                <Table.Cell>
                  <Text>{blog.title}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })}
                  </Text>
                </Table.Cell>
                <Table.Cell>
                  <Flex align="center" gap="2">
                    <Button
                      variant="ghost"
                      onClick={() => togglePublish(blog)}
                      disabled={publishLoadingStates[blog.id]}
                    >
                      {publishLoadingStates[blog.id] ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <FaExchangeAlt />
                      )}
                    </Button>
                    <Text>{blog.isPublished ? "Published" : "Draft"}</Text>
                  </Flex>
                </Table.Cell>
                <Table.Cell>
                  <Flex gap="3">
                    <Link href={`/blogs/${blog.id}`} title="View">
                      <Button variant="ghost">
                        <FaEye />
                      </Button>
                    </Link>
                    <Link href={`/blogs/${blog.id}/edit`} title="Edit">
                      <Button variant="ghost">
                        <FaEdit />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      color="red"
                      onClick={() => deleteBlog(blog.id)}
                      disabled={deleteLoadingStates[blog.id]}
                    >
                      {deleteLoadingStates[blog.id] ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <FaTrash />
                      )}
                    </Button>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
};

export default BlogTable;

// app/blogs/BlogsTable.tsx (new client component)
"use client";

import { Button, Checkbox, Flex, Table } from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { Blog } from "@/types";

interface Props {
  blogs: Blog[];
}

const BlogTable = ({ blogs }: Props) => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);

  const toggleBlogSelection = (id: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(id)
        ? prev.filter((blogId) => blogId !== id)
        : [...prev, id]
    );
  };

  const selectAllBlogs = () => {
    setSelectedBlogs(blogs.map((blog) => blog.id));
  };

  const deselectAllBlogs = () => {
    setSelectedBlogs([]);
  };

  const deleteSelectedBlogs = async () => {
    try {
      await axios.delete("/api/blogs", {
        data: { ids: selectedBlogs },
      });
      setSelectedBlogs((prev) =>
        prev.filter((blog) => !selectedBlogs.includes(blog))
      );
    } catch (error) {
      console.error("Error deleting blogs:", error);
    }
  };

  return (
    <div>
      <Flex gap="2" mb="4">
        <Button onClick={selectAllBlogs}>Select All</Button>
        <Button onClick={deselectAllBlogs}>Deselect All</Button>
        {selectedBlogs.length > 0 && (
          <Button color="red" onClick={deleteSelectedBlogs}>
            Delete Selected
          </Button>
        )}
      </Flex>

      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Select</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {blogs.map((blog) => (
            <Table.Row key={blog.id}>
              <Table.Cell>
                <Checkbox
                  checked={selectedBlogs.includes(blog.id)}
                  onCheckedChange={() => toggleBlogSelection(blog.id)}
                />
              </Table.Cell>
              <Table.Cell>{blog.title}</Table.Cell>
              <Table.Cell>
                {blog.isPublished ? "Published" : "Draft"}
              </Table.Cell>
              <Table.Cell>
                {new Date(blog.createdAt).toLocaleDateString()}
              </Table.Cell>
              <Table.Cell>
                <Link href={`/blogs/${blog.id}`}>View</Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default BlogTable;

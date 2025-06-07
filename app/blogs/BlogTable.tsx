// app/blogs/BlogsTable.tsx (new client component)
"use client";

import { Button, Checkbox, Flex, Table } from "@radix-ui/themes";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

interface User {
  userId: string;
  name: string;
  email: string;
  image: string;
}

interface Comment {
  commentId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  blogId: string;
  user: User;
}

interface Blog {
  blogId: string;
  title: string;
  content: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  author: User;
  comments: Comment[];
}

const BlogsTable = ({ blogs }: { blogs: Blog[] }) => {
  const [selectedBlogs, setSelectedBlogs] = useState<string[]>([]);
  const [blogList, setBlogList] = useState<Blog[]>(blogs);

  const toggleBlogSelection = (blogId: string) => {
    setSelectedBlogs((prev) =>
      prev.includes(blogId)
        ? prev.filter((id) => id !== blogId)
        : [...prev, blogId]
    );
  };

  const toggleAllBlogs = () => {
    if (selectedBlogs.length === blogs.length) {
      setSelectedBlogs([]);
    } else {
      setSelectedBlogs(blogs.map((blog) => blog.blogId));
    }
  };

  const handleDeleteSelected = async () => {
    // Implement your delete logic here
    // You might want to use fetch API to call a route handler
    try {
      console.log({ data: selectedBlogs });
      await axios.delete("/api/blogs", { data: { ids: selectedBlogs } });
      setBlogList((prev) =>
        prev.filter((blog) => !selectedBlogs.includes(blog.blogId))
      );
      setSelectedBlogs([]);
    } catch (error) {
      console.error("Error deleting blogs:", error);
    }
  };

  return (
    <div>
      <Flex gap="3" mb="4" align="center">
        <Button>
          <Link href="/blogs/new">New Blog</Link>
        </Button>

        {selectedBlogs.length > 0 && (
          <Button color="red" onClick={handleDeleteSelected}>
            Delete Selected ({selectedBlogs.length})
          </Button>
        )}
      </Flex>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>
              <Checkbox
                checked={
                  selectedBlogs.length === blogs.length && blogs.length > 0
                }
                className={
                  selectedBlogs.length > 0 &&
                  selectedBlogs.length < blogs.length
                    ? "indeterminate"
                    : ""
                }
                onCheckedChange={toggleAllBlogs}
              />
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Author</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Comments</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {blogList.map((blog) => (
            <Table.Row key={blog.blogId}>
              <Table.Cell>
                <Checkbox
                  checked={selectedBlogs.includes(blog.blogId)}
                  onCheckedChange={() => toggleBlogSelection(blog.blogId)}
                />
              </Table.Cell>
              <Table.RowHeaderCell>{blog.title}</Table.RowHeaderCell>
              <Table.Cell>{blog.author.name}</Table.Cell>
              <Table.Cell>{blog.createdAt.toDateString()}</Table.Cell>
              <Table.Cell>{blog.comments.length}</Table.Cell>
              <Table.Cell>{blog.isPublished ? "Published" : "Draft"}</Table.Cell>
              <Table.Cell>
                <Link href={`/blogs/${blog.blogId}`}>View</Link>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default BlogsTable;

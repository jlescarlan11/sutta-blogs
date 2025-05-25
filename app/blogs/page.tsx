import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import { Table } from "@radix-ui/themes";
import prisma from "@/prisma/client";

const BlogsPage = async () => {
  const blogs = await prisma.blog.findMany();

  return (
    <div>
      <Button>
        <Link href="/blogs/new">New Blog</Link>
      </Button>

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {blogs.map((blog) => (
            <Table.Row key={blog.id}>
              <Table.RowHeaderCell>{blog.title}</Table.RowHeaderCell>
              <Table.Cell>{blog.createdAt.toDateString()}</Table.Cell>
              <Table.Cell>{blog.published ? "Published" : "Draft"}</Table.Cell>
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

export default BlogsPage;

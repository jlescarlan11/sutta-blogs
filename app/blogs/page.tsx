import { Button } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";

const BlogsPage = () => {
  return (
    <div>
      <Button>
        <Link href="/blogs/new">New Blog</Link>
      </Button>
    </div>
  );
};

export default BlogsPage;

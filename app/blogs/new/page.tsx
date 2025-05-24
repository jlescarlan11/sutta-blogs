"use client";
import { Button, TextField } from "@radix-ui/themes";
import "easymde/dist/easymde.min.css";
import SimpleMDE from "react-simplemde-editor";

const NewBlogPage = () => {
  return (
    <div className="max-w-xl space-y-2">
      <TextField.Root placeholder="Title"></TextField.Root>
      <SimpleMDE placeholder="Content" />
      <Button>Submit New Blog</Button>
    </div>
  );
};

export default NewBlogPage;

import { Button, TextArea, TextField } from "@radix-ui/themes";
import React from "react";

const NewBlogPage = () => {
  return (
    <div className="max-w-xl space-y-2">
      <TextField.Root placeholder="Title"></TextField.Root>
      <TextArea placeholder="Content" />
      <Button>Submit New Blog</Button>
    </div>
  );
};

export default NewBlogPage;

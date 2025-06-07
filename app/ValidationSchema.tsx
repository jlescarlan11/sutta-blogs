import { z } from "zod";

export const createBlogSchema = z.object({
  title: z.string().min(1).max(55),
  content: z.string().min(1),
  isPublished: z.boolean(),
});

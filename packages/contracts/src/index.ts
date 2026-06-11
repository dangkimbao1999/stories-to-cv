import { z } from "zod";

export const jdInputSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  content: z.string().min(1)
});

export type JdInput = z.infer<typeof jdInputSchema>;

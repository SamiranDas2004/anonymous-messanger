import { z } from 'zod';

export const messageSchema = z.object({
  username:z.string(),
  content: z.string().min(10, { message: "must be more than 10 characters" }),
});

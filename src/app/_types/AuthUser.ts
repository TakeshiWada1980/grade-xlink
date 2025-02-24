import { z } from "zod";

export const authUserSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  exp: z.date().optional(), // TokenExpirationTime
});

export type AuthUser = z.infer<typeof authUserSchema>;

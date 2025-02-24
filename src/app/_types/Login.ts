import { z } from "zod";
import { passwordSchema } from "./Schemas";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
});

export type LoginRequest = z.infer<typeof loginRequestSchema>;

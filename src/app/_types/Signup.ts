import { z } from "zod";
import { passwordSchema } from "./Schemas";

export const signupRequestSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: passwordSchema,
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;

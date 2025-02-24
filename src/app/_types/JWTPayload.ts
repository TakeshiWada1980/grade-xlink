import { z } from "zod";

export const JWTPayloadSchema = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  iat: z.number().optional(),
  exp: z.number().optional(),
});

export type JWTPayload = z.infer<typeof JWTPayloadSchema>;

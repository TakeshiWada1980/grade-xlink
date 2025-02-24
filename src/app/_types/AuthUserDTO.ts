import { z } from "zod";

export const authUserSchemaDTO = z.object({
  userId: z.string(),
  email: z.string(),
  name: z.string(),
  role: z.string(),
  exp: z.number().optional(), // TokenExpirationTime
});

export type AuthUserDTO = z.infer<typeof authUserSchemaDTO>;

import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().trim().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  API_BASE_URL: z.string().url().optional(),
});

export const env = envSchema.parse(process.env);

import { registry } from "../lib/openapi.lib";
import { z } from "zod";

export const menuIdSchema = registry.register(
  "MenuIdParams",
  z.object({
    id: z.coerce.number().int().positive(),
  }),
);

export const createMenuSchema = registry.register(
  "CreateMenuInput",
  z.object({
    name: z.string().trim().min(1, "Name is required").openapi({
      example: "Pizza",
    }),
    price: z.number().nonnegative().openapi({
      example: 12.5,
    }),
  }),
);

export const updateMenuSchema = registry.register(
  "UpdateMenuInput",
  createMenuSchema
    .omit({})
    .partial()
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided",
    }),
);

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;

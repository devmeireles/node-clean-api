import { z } from "zod";
import { registry } from "@/api/lib/openapi.lib";
import { paginationMetaResponseSchema } from "./pagination.schema";

export const menuIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const menuSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  price: z.number().nonnegative(),
  minPeople: z.number().int().positive(),
  maxPeople: z.number().int().positive(),
});

export const createMenuSchema = z.object({
  name: z.string().trim().min(1),
  price: z.number().nonnegative(),
  minPeople: z.number().int().positive(),
  maxPeople: z.number().int().positive(),
});

export const updateMenuSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    price: z.number().nonnegative().optional(),
    minPeople: z.number().int().positive().optional(),
    maxPeople: z.number().int().positive().optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "At least one field must be provided",
  });

export const menuResponseSchema = z.object({
  success: z.literal(true),
  data: menuSchema,
});

export const menusResponseSchema = z.object({
  success: z.literal(true),
  data: z.array(menuSchema),
  meta: paginationMetaResponseSchema,
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
  }),
});

registry.register("Menu", menuSchema);
registry.register("CreateMenu", createMenuSchema);
registry.register("UpdateMenu", updateMenuSchema);
registry.register("MenuResponse", menuResponseSchema);
registry.register("MenusResponse", menusResponseSchema);
registry.register("ErrorResponse", errorResponseSchema);

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;

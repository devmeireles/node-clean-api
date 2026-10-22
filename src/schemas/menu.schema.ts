import { z } from "zod";

export const menuIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMenuSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  price: z.number().nonnegative(),
});

export const updateMenuSchema = createMenuSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });


export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
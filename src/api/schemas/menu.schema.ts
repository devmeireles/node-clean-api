import { z } from "zod";

export const menuIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createMenuSchema = z
  .object({
    name: z.string().trim().min(1),
    price: z.number().nonnegative(),
    minPeople: z.number().int().positive(),
    maxPeople: z.number().int().positive(),
  })
  .refine((data) => data.maxPeople >= data.minPeople, {
    message: "Maximum people must be greater than or equal to minimum people",
    path: ["maxPeople"],
  });

export const updateMenuSchema = z
  .object({
    name: z.string().trim().min(1).optional(),
    price: z.number().nonnegative().optional(),
    minPeople: z.number().int().positive().optional(),
    maxPeople: z.number().int().positive().optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one field must be provided" },
  );

export type CreateMenuInput = z.infer<typeof createMenuSchema>;
export type UpdateMenuInput = z.infer<typeof updateMenuSchema>;
import { z } from "zod";

export const VoidCreateSchema = z.object({
  title: z.string(),
  price: z.coerce.number().min(0, "Price must be non-negative")
});
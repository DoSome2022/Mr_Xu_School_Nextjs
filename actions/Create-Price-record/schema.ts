import { z } from "zod";

export const Price_Record_Create_Schema = z.object({
    price: z.number(),
    parent_name: z.string()
})
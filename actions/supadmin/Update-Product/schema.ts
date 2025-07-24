import { z } from "zod";

export const SupProduct_Update_Schema = z.object({
    supadminid:z.string(),
    productid: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
})
import { z } from "zod";

export const Product_Update_Schema = z.object({
    productid: z.string(),
    name: z.string(),
    description: z.string(),
    price: z.number(),
})
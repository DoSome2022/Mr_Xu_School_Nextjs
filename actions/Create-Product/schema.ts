import { z } from "zod";

export const Product_Create_Schema = z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    stock: z.number(),
    product_price_record_id: z.string(),
    Course_id: z.string(),
})
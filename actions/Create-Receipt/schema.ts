import { z } from "zod"

export const Receipt_Create_Schema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    content: z.array(z.string()),
    price: z.number(),
    PaymentMethods: z.string(),
    studentname: z.string(),
    DB: z.number(),
    adminFee: z.number(),
})
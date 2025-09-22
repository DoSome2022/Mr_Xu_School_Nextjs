import { z } from "zod";

export const SupNews_Create_Schema = z.object({
    supadminid: z.string(),
    title: z.string(),
    content: z.string(),
    date: z.string(),
})
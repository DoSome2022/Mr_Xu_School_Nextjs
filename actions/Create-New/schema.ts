import { z } from "zod";

export const News_Create_Schema = z.object({
    title: z.string(),
    content: z.string(),
    date: z.string(),
})
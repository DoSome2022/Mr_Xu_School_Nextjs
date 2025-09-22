import { z } from "zod";

export const News_Update_Schema = z.object({
    NewId : z.string(),
    title: z.string(),
    content: z.string(),
    date: z.string(),
})
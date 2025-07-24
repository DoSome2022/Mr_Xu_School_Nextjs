import { z } from "zod";

export const SupNews_Update_Schema = z.object({
    supadminid: z.string(),
    NewId : z.string(),
    title: z.string(),
    content: z.string(),
    date: z.string(),
})
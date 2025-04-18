import { z } from "zod";

export const Node_Create_Schema = z.object({
    name: z.string(),
    title: z.string(),
    subject: z.string(),
    author: z.string(),
    img: z.string(),
    answer: z.boolean(),
    node_lesson: z.string(),
    grade: z.number(),
    language: z.string(),
    teacher: z.string()
})
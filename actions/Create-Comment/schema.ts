import { z } from "zod";

export const Comment_Create_Schema = z.object({
    content: z.string(),
    author: z.string(),
    student_id: z.string(),
})
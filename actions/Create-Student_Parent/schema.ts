import { z } from "zod";

export const student_parent_create_Schema = z.object({
    id: z.string(),
    name: z.string(),
    school: z.string(),
    grade: z.number(),
})
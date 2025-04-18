import { z } from "zod";

export const parent_student_ex_scope_create_schema = z.object({
    parentid: z.string(),
    name: z.string(),
    img: z.string(),
    student_ex_scope_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    quarter: z.number(),
    school: z.string(),
    subject: z.string(),
    originalFileName: z.string().optional()
})
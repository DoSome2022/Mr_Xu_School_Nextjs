import { z } from "zod";

export const student_ex_scope_Create_Schema = z.object({
    name: z.string(),
    img: z.string(),
    student_ex_scope_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    quarter: z.number(),
    school: z.string(),
    subject: z.string(),
    parentId: z.string(),
    
})
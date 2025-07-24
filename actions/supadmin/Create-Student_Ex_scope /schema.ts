import { z } from "zod";

export const Supstudent_ex_scope_Create_Schema = z.object({
    supadminId:z.string(),
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
import { z } from "zod"; 

export const parent_student_ex_pager_create_schema = z.object({
    parentid: z.string(),
    name : z.string().min(1),
    img: z.string(),
    student_ex_paper_id: z.string(),
    student_name: z.string(),
    grade:z.number(),
    year:z.string(),
    quarter:z.number(),
    school:z.string(),
    subject:z.string(),
    originalFileName: z.string().optional()
})
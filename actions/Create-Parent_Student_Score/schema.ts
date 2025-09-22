import { z } from "zod";

export const parent_student_score_create_schema = z.object({
    student_score_id : z.string(),
    grade : z.number(),
    subject : z.string(),
    score : z .number(),
    quarter : z.number(),
    student_name : z.string(),
    school : z.string(),
    year: z.string(),
    name: z.string(),
    img: z.string(),
    parentid:z.string(),
    originalFileName: z.string(),
})
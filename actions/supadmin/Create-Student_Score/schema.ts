import { z } from "zod";

export const Supstudent_score_Create_Schema = z.object({
    supadminId: z.string(),
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
    parentId: z.string(),
})
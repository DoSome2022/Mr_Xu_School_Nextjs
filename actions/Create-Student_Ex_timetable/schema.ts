import { z } from "zod";

export const student_ex_timetable_Create_Schema = z.object({
    name: z.string(),
    img: z.string(),
    student_ex_timetable_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
    school: z.string(),
    subject: z.string(),
})
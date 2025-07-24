import { z } from "zod";

export const Supstudent_ex_timetable_Create_Schema = z.object({
    supadminId: z.string(),
    name: z.string(),
    img: z.string(),
    student_ex_timetable_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
    school: z.string(),
    subject: z.string(),
    parentId: z.string(),
})
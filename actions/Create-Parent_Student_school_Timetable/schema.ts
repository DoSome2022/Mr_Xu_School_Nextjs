import { z } from "zod";

export const parent_student_school_timetable_create_schema = z.object({
    parentid:z.string(),
    name: z.string(),
    img: z.string(),
    student_school_timetable_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
    school: z.string(),
    originalFileName:z.string(),
})
import { z } from "zod";

export const parent_student_ex_timetable_create_schema = z.object({
    parentid: z.string(),
    name: z.string(),
    img: z.string(),
    student_ex_timetable_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
    school: z.string(),
    subject: z.string(),
    originalFileName: z.string(), // 添加這一行
})
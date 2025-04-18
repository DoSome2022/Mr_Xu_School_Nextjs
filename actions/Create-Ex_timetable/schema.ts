import { z } from "zod";

export const Ex_timetable_Create_Schema = z.object({
    name: z.string(),
    img: z.string(),
    school_ex_time_id: z.string(),
    school_name: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
    subject: z.string(),
})
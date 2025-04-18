import { z } from "zod";

export const School_timetable_Create_Schema = z.object({
    name: z.string(),
    img: z.string(),
    school_school_timetable_id: z.string(),
    school_name: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
})
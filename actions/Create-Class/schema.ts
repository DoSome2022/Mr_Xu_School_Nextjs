import { z } from "zod";


export const Class_Create_Schema = z.object({
    day: z.string(),
    title: z.string(),

    class_start_time: z.string(),
    class_end_time: z.string(),
    class_time_h : z.number(),
    classroom: z.string(),
    class_lesson: z.string(),
    class_course_id: z.string(),
    attend_number: z.number(),
    persons: z.number().min(0, { message: "課堂人數必須大於 0" }), // 確保 persons 是數字且大於 0
    node: z.number(),
    teacher: z.string(),
    grade: z.number(),

    // cram: z.string(),
    
})


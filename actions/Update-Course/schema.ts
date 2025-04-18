import { z } from "zod";

export const Course_Update_Schema = z.object({
    courseId: z.string(),
    course_name: z.string(),
    course_subject: z.string(),
    persons: z.number(),
    grade: z.number(),
    course_level: z.string(),
    teacher: z.string(),
    course_teacher_data_id: z.array(z.string()),   
})
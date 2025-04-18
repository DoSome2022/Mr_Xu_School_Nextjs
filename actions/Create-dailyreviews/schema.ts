import { z } from "zod";

export const Create_Dailyreviews_Schema = z.object({
    title: z.string(),
    content: z.string(),
    student_id: z.string(),
    teacher_id: z.string(),
})
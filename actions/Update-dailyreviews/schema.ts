import { z } from "zod";

export const Update_Dailyreviews_Schema = z.object({
    id: z.string(),
    title: z.string(),
    content: z.string(),
    student_id: z.string(),
    teacher_id: z.string(),
})
import {z} from "zod";

export const LessonCal_Update_Schema = z.object({
    lscId: z.string(),
    lesson_date: z.record(z.string()
        .min(1, "課程日期不能為空"))
        .refine((date) => !!isNaN(Date.parse(date)),{
            message: "日期格式無效"  
        }),
    course_lesson: z.record(z.string().min(1, "課程節數不能為空")),

})


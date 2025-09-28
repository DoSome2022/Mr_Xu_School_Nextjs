import { z } from "zod";

// Course_Create_Form 中的 schema 和表單調整
export const SupCourse_Create_Schema = z.object({
    supadminid:z.string(),
    course_name: z.string().min(1, "課程名稱不能為空"),
    course_subject: z.string().optional(),
    persons: z.number().min(0, "人數不能為負數"),
    grade: z.number().min(1, "年級必須選擇"),
    teacher: z.string().min(1, "老師不能為空"),
    course_teacher_data_id: z.array(z.string()),
    TimeTemplateID: z.string().min(1, "TimeTemplateID 不能為空"), // 只保留 ID
    classroom: z.string().min(1, "教室不能為空"),
    day_start: z.string(),
    day_end: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    days: z.array(
        z.object({
            date: z.string(),
            start_time: z.string(),
            end_time: z.string(),
            lesson: z.string(),
        })
    ),
    weekdays: z.array(
        z.object({
            date: z.string(),
            start_time: z.string(),
            end_time: z.string(),
            lesson: z.string(),
        })
    ),
    publicHoliday_model: z.array(z.string()),
});
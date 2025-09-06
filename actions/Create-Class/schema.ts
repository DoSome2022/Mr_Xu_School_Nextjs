// import { z } from "zod";


// export const Class_Create_Schema = z.object({
//     day: z.string(),
//     title: z.string(),

//     class_start_time: z.string(),
//     class_end_time: z.string(),
//     class_time_h : z.number(),
//     classroom: z.string(),
//     class_lesson: z.string(),
//     class_course_id: z.string(),
//     attend_number: z.number(),
//     persons: z.number().min(0, { message: "課堂人數必須大於 0" }), // 確保 persons 是數字且大於 0
//     node: z.number(),
//     teacher: z.string(),
//     grade: z.number(),

//     // cram: z.string(),
    
// })

import { z } from "zod";

export const Class_Create_Schema = z.object({
  class_date: z.array(z.string()).min(1, { message: "課程日期不能為空" }),
  title: z.string().optional(),
  class_start_time: z.string(),
  class_end_time: z.string(),
  class_time_h: z.number(),
  classroom: z.string(),
  class_lesson: z.string(),
  class_course_id: z.string(),
  attend_number: z.number(),
  persons: z.number().min(0, { message: "課堂人數必須大於 0" }),
  node: z.number(),
  teacher: z.string(),
  grade: z.number(),
  freq: z.string().optional(),
  byweekday: z.any().optional(), // Json 類型使用 z.any()，可根據需要加強驗證
  allDay: z.boolean().optional(),
  cram: z.string(), // 添加 cram 字段
  class_subject: z.string(), // 添加 class_subject 字段
});
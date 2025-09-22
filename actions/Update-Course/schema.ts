// import { z } from "zod";

// export const Course_Update_Schema = z.object({
//     courseId: z.string(),
//     course_name: z.string(),
//     course_subject: z.string(),
//     persons: z.number(),
//     grade: z.number(),
//     course_level: z.string(),
//     teacher: z.string(),
//     course_teacher_data_id: z.array(z.string()),   
// })


// import { z } from "zod";

// export const Course_Update_Schema = z.object({
//   courseId: z.string().min(1, { message: "課程 ID 不可為空" }),
//   course_name: z.string().min(1, { message: "課程名稱不可為空" }),
//   course_subject: z.string().min(1, { message: "課程科目不可為空" }),
//   persons: z.number().min(0, { message: "人數必須大於等於0" }),
//   grade: z.number().min(0, { message: "年級必須大於等於0" }),
//   teacher: z.string().min(1, { message: "教師不可為空" }),
//   course_teacher_data_id: z.string().optional(), // 改為單一字串，可選
// });


import { z } from "zod";

export const Course_Update_Schema = z.object({
  courseId: z.string().min(1, { message: "課程 ID 不可為空" }),
  course_name: z.string().min(1, { message: "課程名稱不可為空" }),
  course_subject: z.string().min(1, { message: "課程科目不可為空" }),
  persons: z.number().min(0, { message: "人數必須大於等於0" }),
  grade: z.number().min(0, { message: "年級必須大於等於0" }),
  teacher: z.string().min(1, { message: "教師不可為空" }),
  course_teacher_data_id: z.array(z.string()).optional(), // 改為字串陣列
});
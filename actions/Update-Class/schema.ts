// import { z } from "zod";


// export const Class_Update_Schema = z.object({
//   classId: z.string(),
//   freq: z.string(),
//   byweekday: z.string(),
//   title: z.string(),
//   allDay : z.boolean(),
//   class_start_time: z.string(),
//   class_end_time: z.string(),
//   class_time_h : z.number(),
//   classroom: z.string(),
//   class_lesson: z.string(),
//   class_course_id: z.string(),
//   attend_number: z.number(),
//   persons: z.number(),
//   node: z.number(),
//   teacher: z.string(),
//   grade: z.number(),


//   cram: z.string(),
//   class_date: z.array(z.date()),

// })



import { z } from "zod";

export const Class_Update_Schema = z.object({
  classId: z.string().min(1, { message: "班級 ID 不可為空" }),
  freq: z.string().min(1, { message: "頻率不可為空" }),
  byweekday: z.string().min(1, { message: "工作日不可為空" }),
  title: z.string().min(1, { message: "標題不可為空" }),
  allDay: z.boolean({ message: "全天狀態必須提供" }),
  class_start_time: z.string().min(1, { message: "開始時間不可為空" }),
  class_end_time: z.string().min(1, { message: "結束時間不可為空" }),
  class_time_h: z.number().min(0, { message: "課程時數必須大於等於0" }),
  classroomId: z.string().min(1, { message: "教室 ID 不可為空" }), // 改用 classroomId
  class_lesson: z.string().min(1, { message: "課程內容不可為空" }),
  class_course_id: z.string().min(1, { message: "課程 ID 不可為空" }),
  attend_number: z.number().min(0, { message: "參加人數必須大於等於0" }),
  persons: z.number().min(0, { message: "總人數必須大於等於0" }),
  node: z.number().min(0, { message: "節點必須大於等於0" }),
  teacher: z.string().min(1, { message: "教師不可為空" }),
  grade: z.number().min(0, { message: "年級必須大於等於0" }),
  cram: z.string().min(1, { message: "補習類型不可為空" }),
  class_date: z.array(z.date()).min(1, { message: "至少選擇一個日期" }),
});
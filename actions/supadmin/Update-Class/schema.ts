// import { z } from "zod";


// export const SupClass_Update_Schema = z.object({
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


// import { z } from "zod";

// export const SupClass_Update_Schema = z.object({
//   classId: z.string().min(1, "班級 ID 不可為空"),
//   freq: z.string().optional(),
//   byweekday: z.string().optional(),
//   title: z.string().optional(),
//   allDay: z.boolean().optional(),
//   class_start_time: z.string().min(1, "開始時間不可為空"),
//   class_end_time: z.string().min(1, "結束時間不可為空"),
//   class_time_h: z.number().min(0, "課程時數必須大於等於 0"),
//   classroom: z.array(z.string()).min(1, "請至少選擇一個教室"), // 改為陣列
//   class_lesson: z.string().min(1, "課程內容不可為空"),
//   class_course_id: z.string().min(1, "課程 ID 不可為空"),
//   attend_number: z.number().min(0, "出席人數必須大於等於 0"),
//   persons: z.number().min(0, "總人數必須大於等於 0"),
//   node: z.number().min(0, "節點必須大於等於 0"),
//   teacher: z.string().min(1, "教師不可為空"),
//   grade: z.number().min(0, "年級必須大於等於 0"),
//   cram: z.string().min(1, "補習班名稱不可為空"),
//   class_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "課程日期格式不正確"), // 修正為字串
// });




// actions/supadmin/Update-Class/schema.ts
import { z } from "zod";

export const SupClass_Update_Schema = z.object({
  classId: z.string().min(1, "班級 ID 不可為空"),
  freq: z.string().optional(),
  byweekday: z.string().optional(),
  title: z.string().optional(),
  allDay: z.boolean().optional(),
  class_start_time: z.string().min(1, "開始時間不可為空"),
  class_end_time: z.string().min(1, "結束時間不可為空"),
  class_time_h: z.number().min(0, "課程時數必須大於等於 0"),
  classroom: z.array(z.string()).min(1, "請至少選擇一個教室"), // 修改為陣列
  class_lesson: z.string().min(1, "課程內容不可為空"),
  class_course_id: z.string().min(1, "課程 ID 不可為空"),
  attend_number: z.number().min(0, "出席人數必須大於等於 0"),
  persons: z.number().min(0, "總人數必須大於等於 0"),
  node: z.number().min(0, "節點必須大於等於 0"),
  teacher: z.string().min(1, "教師不可為空"),
  grade: z.number().min(0, "年級必須大於等於 0"),
  cram: z.string().min(1, "補習班名稱不可為空"),
  class_date: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "課程日期格式不正確")).min(1, "請選擇至少一個日期"),
});
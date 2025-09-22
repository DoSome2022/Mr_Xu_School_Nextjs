// import { z } from "zod";

// export const Ex_timetable_Create_Schema = z.object({
//     name: z.string(),
//     img: z.string(),
//     school_ex_time_id: z.string(),
//     school_name: z.string(),
//     grade: z.number(),
//     year: z.string(),
//     quarter: z.number(),
//     subject: z.string(),
// })

// actions/Create-Ex_timetable/schema.ts
import { z } from "zod";

export const Ex_timetable_Create_Schema = z.object({
  name: z.string().min(1, "標題為必填項"),
  school_name: z.string().min(1, "學校名稱為必填項"),
  year: z.string().min(1, "年份為必填項"),
  grade: z.number().min(0, "年級必須為非負數"),
  quarter: z.number().min(0, "季度必須為非負數"),
  school_ex_time_id: z.string().min(1, "學校 ID 為必填項"),
  subject: z.string().min(1, "科目為必填項"),
  img: z.string().optional(), // Base64 數據
  originalFileName: z.string().optional(), // 原始文件名
});
// import { z } from "zod"

// // 更新schema，添加lesson字段
// export const weekdaySchema = z.object({
//     date: z.string(),
//     start_time: z.string(),
//     end_time: z.string(),
//     lesson: z.string(), // 新增
//   });
  
//   export const daySchema = z.object({
//     date: z.string(),
//     start_time: z.string(),
//     end_time: z.string(),
//     lesson: z.string(), // 新增
//   });

// export const timetemplate_create_Schema = z.object({
//     title: z.string(),
//     day_start : z.string(),
//     day_end : z.string(),
//     publicholiday: z.array(z.string()),
//     weekdays: z.array(weekdaySchema).min(0, '至少選擇一個星期'),
//     days: z.array(daySchema).min(0, '隨便選擇一個日期'),
//     start_time: z.string(),
//     end_time: z.string(),
//     lesson: z.string(),
//     grade: z.number(),
// })


import { z } from "zod";

export const weekdaySchema = z.object({
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  lesson: z.string(),
});

export const daySchema = z.object({
  date: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  lesson: z.string(),
});

export const timetemplate_create_Schema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  day_start: z.string().min(1, { message: "開始日期不能為空" }),
  day_end: z.string().min(1, { message: "結束日期不能為空" }),
  publicHoliday: z.array(z.string()), // 修正拼寫
  weekdays: z.array(weekdaySchema).min(0, { message: "至少選擇一個工作日" }),
  days: z.array(daySchema).min(0, { message: "至少選擇一個日期" }),
  start_time: z.string(),
  end_time: z.string(),
  lesson: z.string(),
  // grade: z.number().min(0, { message: "年級必須大於等於0" }),
});
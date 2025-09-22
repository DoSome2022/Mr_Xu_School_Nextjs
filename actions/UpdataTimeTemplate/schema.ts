import { z } from "zod"

// 更新schema，添加lesson字段
export const weekdaySchema = z.object({
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    lesson: z.string(), // 新增
  });
  
  export const daySchema = z.object({
    date: z.string(),
    start_time: z.string(),
    end_time: z.string(),
    lesson: z.string(), // 新增
  });

export const timetemplate_Updata_Schema = z.object({
    id: z.string(),
    title: z.string(),
    day_start : z.string(),
    day_end : z.string(),
    publicholiday: z.array(z.string()),
    weekdays: z.array(weekdaySchema).min(0, '至少選擇一個星期'),
    days: z.array(daySchema).min(0, '隨便選擇一個日期'),
    start_time: z.string(),
    end_time: z.string(),
    // grade: z.number(),
    lesson: z.string(),
})
import { z } from "zod";

export const School_Ex_Day_Schema = z.object({
    school_ex_day_id: z.string(),
    subject: z.string(),
    grade: z.number(),
    year: z.string(), // 确保是字符串类型
    quarter: z.number(),
    EX_Day: z.string(),
    title: z.string(),
});
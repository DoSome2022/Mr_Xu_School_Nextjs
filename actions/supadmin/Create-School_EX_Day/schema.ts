import { z } from "zod";

export const SupSchool_Ex_Day_Schema = z.object({
    supadminid: z.string(),
    school_ex_day_id: z.string(),
    subject: z.string(),
    grade: z.number(),
    year: z.string(), // 确保是字符串类型
    quarter: z.number(),
    EX_Day: z.string(),
    title: z.string(),
});
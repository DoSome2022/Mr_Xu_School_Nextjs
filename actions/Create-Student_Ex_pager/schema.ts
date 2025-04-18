import { z } from "zod";

export const student_ex_paper_Create_Schema = z.object({
    name: z.string().min(1,'最少輸入1個名'),
    img: z.string(),
    student_ex_paper_id: z.string(),
    student_name: z.string().min(1,'最少輸入1個名'),
    subject: z.string().min(1,'請選擇科目'),
    grade: z.number().min(1,'請選擇年級'),
    year: z.string().min(1,'請選擇年份'),
    quarter: z.number().min(1,'請選擇季度'),
    school: z.string()
})
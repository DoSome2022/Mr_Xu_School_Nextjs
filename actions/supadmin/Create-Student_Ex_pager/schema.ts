import { z } from "zod";

export const Supstudent_ex_paper_Create_Schema = z.object({
    supadminId: z.string(),
    name: z.string(),
    img: z.string(),
    student_ex_paper_id: z.string(),
    student_name: z.string(),
    subject: z.string().min(1,'請選擇科目'),
    grade: z.number().min(1,'請選擇年級'),
    year: z.string().min(1,'請選擇年份'),
    quarter: z.number().min(1,'請選擇季度'),
    school: z.string(),
    parentId: z.string(),
})
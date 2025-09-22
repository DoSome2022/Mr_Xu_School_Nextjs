import { z } from "zod";

export const Supstudent_booklist_Create_Schema = z.object({
    supadminId: z.string(),
    studentId: z.string(),
    parentId:  z.string(),
    name : z.string().min(1,'最少輸入1個名'),
    img : z.string(),
    student_booklist_id : z.string(),
    student_name : z.string().min(1,'最少輸入1個名'),
    grade : z.number().min(1,'請選擇年級'),
    year : z.string().min(1,'請選擇年份'),
    school : z.string(),
})
import { z } from "zod"; 

export const parent_student_booklist_create_schema = z.object({
    parentid: z.string(),
    name: z.string().min(1, "標題不能為空"),
    student_booklist_id: z.string(),
    student_name: z.string(),
    grade: z.number(),
    year: z.string(),
    school: z.string(),
    img: z.string().optional(),
    originalFileName: z.string().optional()
});
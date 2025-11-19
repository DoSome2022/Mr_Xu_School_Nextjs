import { z } from "zod";

export const SupStudent_Update_Schema = z.object({
    name: z.string().min(1,"最少1個值"),
    school: z.string().min(1,"最少1個值"),
    grade: z.number().min(1,"最少1個值"),

    student_id : z.string().min(1,"最少1個值"),
    pay : z.boolean(),
    student_parent_data_id : z.string().min(0,"最少1個值"),
    studentId:z.string(),
    chine_ex_day: z.string().min(0,"最少1個值"),
    math_ex_day: z.string().min(0,"最少1個值"),
    eng_ex_day: z.string().min(0,"最少1個值"),
    supadminId:z.string().min(0,"最少1個值"),
})
import { z } from "zod";

export const SupStudent_Create_Schema = z.object({
    name: z.string().min(1,"最少1個值"),
    school: z.string().min(1,"最少1個值"),
    grade: z.number().min(1,"最少1個值"),
    // final_day: z.union([z.date(), z.null()]),
    chine_ex_day: z.string(),
    math_ex_day: z.string(),
    eng_ex_day: z.string(),
    student_id : z.string().min(1,"最少1個值"),
    teachers : z.string().min(0,"最少1個值"),
    pay : z.boolean(),
    student_parent_data_id : z.string().min(0,"最少1個值"),
    student_class_id : z.string().min(0,"最少1個值"),
    student_teacher_data_id : z.string().min(0,"最少1個值"),
    supadminId:z.string(),

})
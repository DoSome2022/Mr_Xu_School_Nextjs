import { z } from "zod";

export const Student_ExDay_Update_Schema = z.object({
    parentid: z.string(),
    studentid: z.string(),
    chine_ex: z.string(),
    math_ex: z.string(),
    eng_ex: z.string(),
})
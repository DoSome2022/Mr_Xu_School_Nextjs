import { z } from "zod";

export const Ex_scope_Create_Schema = z.object({
    name: z.string(),
    img: z.string(),
    school_ex_scope_id: z.string(),
    school_name: z.string(),
    subject: z.string(),
    grade: z.number(),
    quarter: z.number(),
})
import { z } from "zod";

export const Ex_pager_Create_Schema = z.object({
    name: z.string(),
    img: z.string(),
    school_ex_pager_id: z.string(),
    school_name: z.string(),
    subject: z.string(),
    grade: z.number(),
    year: z.string(),
    quarter: z.number(),
})
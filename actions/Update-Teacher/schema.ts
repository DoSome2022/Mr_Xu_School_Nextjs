import { z } from "zod";

export const Teacher_Update_Schema = z.object({
    teacherid: z.string(),
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
    staff: z.boolean().default(false).optional(),
    isadmin: z.boolean().default(false).optional(),
})
import { z } from "zod";

export const Teacher_Create_Schema = z.object({
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.string(),
    password: z.string(),
    staff: z.boolean().default(true).optional(),
    isadmin: z.boolean().default(true).optional(),
})
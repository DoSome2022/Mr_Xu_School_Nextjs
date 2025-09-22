import { z } from "zod";

export const Admin_Update_Schema = z.object({
    userid: z.string(),
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    cram: z.string(),
    phone: z.string(),
    staff: z.boolean().default(true).optional(),
    isadmin: z.boolean().default(true).optional(),
})
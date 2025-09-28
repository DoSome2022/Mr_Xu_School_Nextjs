import { z } from "zod";

export const SupParent_Update_Schema = z.object({
    supadminid: z.string(),
    userid: z.string(),
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
})
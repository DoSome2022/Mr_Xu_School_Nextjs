import { z } from "zod";

export const SupParent_Update_Schema = z.object({
    userid: z.string(),
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
})
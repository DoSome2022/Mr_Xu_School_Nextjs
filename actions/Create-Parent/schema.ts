import { z } from "zod";

export const Parent_Create_Schema = z.object({
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.string(),
    password: z.string(),
})
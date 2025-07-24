import { z } from "zod";

export const SupParent_Create_Schema = z.object({
    supadminid: z.string(),
    username: z.string(),
    nickname: z.string(),
    email: z.string(),
    phone: z.string(),
    role: z.string(),
    password: z.string(),
})
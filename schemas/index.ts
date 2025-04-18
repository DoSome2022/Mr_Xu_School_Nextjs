import { z } from "zod"; 

export const staffUser_Login_Schema = z.object({
    username: z.string().min(1,{
        message:"請輸入username"
    }),
    password: z.string().min(1,{
        message:"請輸入password"
    }),
    staff : z.boolean().default(false).optional(),
    isadmin : z.boolean().default(false).optional()
})

export const Login_Schema = z.object({
    username: z.string().min(1,{
        message:"請輸入username"
    }),
    password: z.string().min(1,{
        message:"請輸入password"
    }),
})
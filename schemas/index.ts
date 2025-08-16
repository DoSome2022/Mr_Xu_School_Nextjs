// import { z } from "zod"; 

// export const staffUser_Login_Schema = z.object({
//     username: z.string().min(1,{
//         message:"請輸入username"
//     }),
//     password: z.string().min(1,{
//         message:"請輸入password"
//     }),
//     staff : z.boolean().default(false).optional(),
//     isadmin : z.boolean().default(false).optional()
// })

// export const Login_Schema = z.object({
//     username: z.string().min(1,{
//         message:"請輸入username"
//     }),
//     password: z.string().min(1,{
//         message:"請輸入password"
//     }),
// })


// // schemas/index.ts
// import * as z from "zod";

// export const staffUser_Login_Schema = z.object({
//   username: z.string().min(1, "請輸入用戶名稱"),
//   password: z.string().min(1, "請輸入密碼"),
//   staff: z
//     .union([z.boolean(), z.string()])
//     .transform((val) => val === "true" || val === true)
//     .default(false),
//   isadmin: z
//     .union([z.boolean(), z.string()])
//     .transform((val) => val === "true" || val === true)
//     .default(false),
// });

// export const Login_Schema = z.object({
//   username: z.string().min(1, "請輸入用戶名稱"),
//   password: z.string().min(1, "請輸入密碼"),
// });


// schemas/index.ts
import * as z from "zod";

export const Login_Schema = z.object({
  username: z.string().min(1, "用戶名稱為必填項"),
  password: z.string().min(1, "密碼為必填項"),
});

export const staffUser_Login_Schema = z.object({
  username: z.string().min(1, "用戶名稱為必填項"),
  password: z.string().min(1, "密碼為必填項"),
  staff: z.boolean().optional(),
  isadmin: z.boolean().optional(),
});
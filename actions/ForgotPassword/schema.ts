import * as z from "zod";

export const ForgotPasswordSchema = z.object({
  username: z.string().min(1, "用戶名稱為必填項"),
  email: z.string().email("請輸入有效的電子郵件地址"),
});
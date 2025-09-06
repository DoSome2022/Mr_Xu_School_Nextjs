import * as z from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "密碼至少需要 6 個字元"),
    confirmPassword: z.string().min(6, "確認密碼至少需要 6 個字元"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼和確認密碼不匹配",
    path: ["confirmPassword"],
  });
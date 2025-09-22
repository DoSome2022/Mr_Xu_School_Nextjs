// actions/forgot-password.ts
"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";
import { ForgotPasswordSchema } from "./schema";

export interface ForgotPasswordResponse {
  error?: string;
  success?: string;
}

export const ForgotPasswordAction = async (
  values: z.infer<typeof ForgotPasswordSchema>
): Promise<ForgotPasswordResponse> => {
  console.log("-- ForgotPasswordAction values -- : ", values);

  const validatedFields = ForgotPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    console.error("-- Validation failed -- : ", validatedFields.error.issues);
    return { error: "無效的字段，請檢查輸入" };
  }

  const { username, email } = validatedFields.data;

  try {
    // 檢查用戶是否存在
    const user = await db.user.findUnique({
      where: { username },
      select: { id: true, email: true },
    });

    if (!user) {
      console.error("-- User not found -- : ", { username });
      return { error: "用戶名稱不存在" };
    }

    if (user.email !== email) {
      console.error("-- Email mismatch -- : ", { inputEmail: email, dbEmail: user.email });
      return { error: "電子郵件與用戶名稱不匹配" };
    }

    // 生成重置密碼 token
    const token = await generatePasswordResetToken(user.id, user.email);

    // 發送重置密碼電子郵件
    await sendPasswordResetEmail(user.email, token);

    console.log("-- Password reset email sent -- : ", { email });
    return { success: "重置密碼連結已發送到您的電子郵件" };
  } catch (error) {
    console.error("-- ForgotPasswordAction error -- : ", error);
    return { error: "發生未知錯誤，請稍後重試" };
  }
};
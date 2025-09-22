// actions/reset-password.ts
"use server";

import { z } from "zod";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { verifyPasswordResetToken } from "@/lib/tokens";
import { ResetPasswordSchema } from "./schema";

export interface ResetPasswordResponse {
  error?: string;
  success?: string;
}

export const ResetPasswordAction = async (
  values: z.infer<typeof ResetPasswordSchema> & { token: string }
): Promise<ResetPasswordResponse> => {
  console.log("-- ResetPasswordAction values -- : ", {
    ...values,
    password: values.password.substring(0, 2) + "****",
    confirmPassword: values.confirmPassword.substring(0, 2) + "****",
  });

  const validatedFields = ResetPasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    console.error("-- Validation failed -- : ", validatedFields.error.issues);
    return { error: "無效的字段，請檢查輸入" };
  }

  const { password, token } = values;

  try {
    // 驗證 token
    const tokenData = await verifyPasswordResetToken(token);
    if (!tokenData) {
      console.error("-- Invalid or expired token -- : ", { token });
      return { error: "無效或過期的重置連結" };
    }

    // 檢查用戶是否存在
    const user = await db.user.findUnique({
      where: { id: tokenData.userId },
    });

    if (!user) {
      console.error("-- User not found -- : ", { userId: tokenData.userId });
      return { error: "用戶不存在" };
    }

    // 更新密碼
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // 可選：刪除已使用的 token
    await db.passwordResetToken.deleteMany({
      where: { token },
    });

    console.log("-- Password reset successful -- : ", { userId: user.id });
    return { success: "密碼已成功重置，請使用新密碼登入" };
  } catch (error) {
    console.error("-- ResetPasswordAction error -- : ", error);
    return { error: "發生未知錯誤，請稍後重試" };
  }
};
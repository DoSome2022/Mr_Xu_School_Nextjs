// lib/tokens.ts
import { db } from "@/lib/db";
import crypto from "crypto";

export const generatePasswordResetToken = async (userId: string, email: string) => {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600 * 1000); // 1 小時有效期

  await db.passwordResetToken.create({
    data: {
      userId,
      email,
      token,
      expires,
    },
  });

  return token;
};

export const verifyPasswordResetToken = async (token: string) => {
  const tokenData = await db.passwordResetToken.findUnique({
    where: { token },
    select: { userId: true, email: true, expires: true },
  });

  if (!tokenData || tokenData.expires < new Date()) {
    return null;
  }

  return tokenData;
};
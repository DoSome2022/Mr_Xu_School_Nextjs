// lib/mail.ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  try {
    await resend.emails.send({
      from: "no-reply@billy.ad",
      to: email,
      subject: "重置您的密碼",
      html: `
        <p>您好，</p>
        <p>請點擊以下連結重置您的密碼。此連結將在 1 小時後過期。</p>
        <p><a href="${resetLink}">重置密碼</a></p>
        <p>如果您未請求重置密碼，請忽略此郵件。</p>
      `,
    });
    console.log("-- Password reset email sent -- : ", { email, resetLink });
  } catch (error) {
    console.error("-- Error sending password reset email -- : ", error);
    throw error;
  }
};
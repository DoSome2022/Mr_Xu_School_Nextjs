// actions/supadmin/Update-Teacher/index.ts

"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupTeacher_Update_Schema } from "./schema";
import { getUserByUserName } from "@/data/user";
import { StaffUser } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { teacherid, username, nickname, email, phone, staff, isadmin, supadminId } = data;

  console.log("-- Teacher_Data_Input -- : ", data, " -- End -- ");

  let teacher_data: StaffUser | undefined;

  try {
    // 驗證教師是否存在
    const existingTeacher = await db.staffUser.findUnique({
      where: { id: teacherid },
    });
    if (!existingTeacher) {
      return { error: "教師記錄不存在" };
    }

    // 驗證用戶名是否被其他用戶占用（排除當前教師）
    const existingUser = await getUserByUserName(username);
    if (existingUser && existingUser.id !== teacherid) {
      return { error: "用戶名已被其他用戶使用" };
    }

    // 驗證 supadminId（如果提供）
    if (supadminId) {
      const existingSupadmin = await db.staffUser.findUnique({
        where: { id: supadminId },
      });
      if (!existingSupadmin) {
        return { error: "管理員ID無效" };
      }
    }

    // 更新教師數據
    teacher_data = await db.staffUser.update({
      where: { id: teacherid },
      data: {
        username,
        nickname,
        email,
        phone,
        Staff: staff,
        ISADMIN: isadmin,
      },
    });

    // 記錄成功更新（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Update_Teacher_Data -- : ", teacher_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/supadmin/${supadminId}/userLists/teachersLists/${teacherid}`);

    return { data: teacher_data, success: "教師資料更新成功" };
  } catch (error: any) {
    console.error("更新教師資料失敗:", error);
    if (error.code === "P2025") {
      return { error: "教師記錄不存在，無法更新" };
    }
    return { error: error.message || "更新教師資料失敗，請檢查輸入數據" };
  }
};

export const SupupdateTeacher = CreateSafeAction(SupTeacher_Update_Schema, handler);
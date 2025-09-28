// actions/supadmin/Update-Parent/index.ts

"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupParent_Update_Schema } from "./schema";
import { User } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userid, username, nickname, email, phone, supadminid } = data;

  let user_data: User | undefined;

  try {
    // 驗證用戶是否存在
    const existingUser = await db.user.findUnique({
      where: { id: userid },
    });
    if (!existingUser) {
      return { error: "用戶不存在" };
    }

    // 驗證 supadminid（如果提供）
    if (supadminid) {
      const existingSupadmin = await db.user.findUnique({
        where: { id: supadminid },
      });
      if (!existingSupadmin) {
        return { error: "管理員ID無效" };
      }
    }

    // 更新用戶數據
    user_data = await db.user.update({
      where: { id: userid },
      data: {
        username,
        nickname,
        email,
        phone,
        parent_message_id: "",
        parent_price_record_id: "",
      },
    });

    // 記錄成功更新（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Update_Parent_Data -- : ", user_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/supadmin/${supadminid}/userLists/parentsLists/${userid}`);

    return { data: user_data, success: "家長資料更新成功" };
  } catch (error: any) {
    console.error("更新家長資料失敗:", error);
    return { error: error.message || "更新家長資料失敗，請檢查輸入數據" };
  }
};

export const SupupdateParent = CreateSafeAction(SupParent_Update_Schema, handler);
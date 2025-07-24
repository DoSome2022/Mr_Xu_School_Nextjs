"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Leave_Student_schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, class_date, date, targetclassId, currentclassId, CourseId } = data;

  let leave_data;

  try {
    // 驗證 targetclassId 是否存在
    const targetClass = await db.class.findUnique({
      where: { id: targetclassId },
    });
    if (!targetClass) {
      return {
        success: false,
        error: "目標班級不存在",
      };
    }

    // 創建請假記錄
    leave_data = await db.leave.create({
      data: {
        name,
        date,
        class_date,
        targetclassId,
        currentclassId,
      },
    });

    console.log("-- Leave_Data -- : ", leave_data, " -- End -- ");

    // 執行重定向
    redirect(`/admin`);
  } catch (error) {
    console.error("創建請假記錄失敗:", error);
    return {
      success: false,
      error: "創建請假記錄失敗，請稍後重試",
    };
  }
};

export const Leave_Student_Action = CreateSafeAction(Leave_Student_schema, handler);
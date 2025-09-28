// actions/supadmin/Update-Student/index.ts

"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupStudent_Update_Schema } from "./schema";
import { Student } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    school,
    grade,
    student_id,
    student_parent_data_id,
    pay = false,
    chine_ex_day,
    math_ex_day,
    eng_ex_day,
    supadminId,
  } = data;

  console.log("-- Student_Data_Input -- : ", data, " -- End -- ");

  let student_data: Student | undefined;

  try {
    // 驗證學生是否存在
    const existingStudent = await db.student.findUnique({
      where: { id: student_id },
    });
    if (!existingStudent) {
      return { error: "學生不存在" };
    }

    // 驗證家長ID
    const existingParent = await db.user.findUnique({
      where: { id: student_parent_data_id },
    });
    if (!existingParent) {
      return { error: "家長ID無效" };
    }

    // 驗證 supadminId（如果提供）
    if (supadminId) {
      const existingSupadmin = await db.user.findUnique({
        where: { id: supadminId },
      });
      if (!existingSupadmin) {
        return { error: "管理員ID無效" };
      }
    }

    // 更新學生數據
    student_data = await db.student.update({
      where: { id: student_id },
      data: {
        name,
        school,
        grade,
        student_id,
        student_parent_data_id,
        pay,
        chine_ex_day,
        math_ex_day,
        eng_ex_day,
        ismember: false,
        issurvive: false,
      },
    });

    // 記錄成功更新（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Update_Student_Data -- : ", student_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/supadmin/${supadminId}/userLists/parentsLists/${student_parent_data_id}/profiles/${student_id}`);

    return { data: student_data, success: "學生資料更新成功" };
  } catch (error: any) {
    console.error("更新學生資料失敗:", error);
    if (error.code === "P2025") {
      return { error: "學生記錄不存在，無法更新" };
    }
    return { error: error.message || "更新學生資料失敗，請檢查輸入數據" };
  }
};

export const SupUpdate_Student = CreateSafeAction(SupStudent_Update_Schema, handler);
// actions/supadmin/Leave-Student/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupLeave_Student_schema } from "./schema";
import { Leave } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, class_date, date, targetclassId, currentclassId, CourseId, supadminId } = data;

  let leave_data: Leave | undefined;

  try {
    // 驗證 targetclassId 是否存在
    const targetClass = await db.class.findUnique({
      where: { id: targetclassId },
    });
    if (!targetClass) {
      return {
        error: "目標班級不存在",
      };
    }

    // 驗證 currentclassId 是否存在
    const currentClass = await db.class.findUnique({
      where: { id: currentclassId },
    });
    if (!currentClass) {
      return {
        error: "當前班級不存在",
      };
    }

    // 驗證學生是否存在
    const students = await db.student.findMany({
      where: { name: { in: name } },
    });
    if (students.length !== name.length) {
      return {
        error: "部分學生不存在",
      };
    }

    // 驗證 targetclassId 和 currentclassId 是否屬於 CourseId
    if (
      targetClass.class_course_id !== CourseId ||
      currentClass.class_course_id !== CourseId
    ) {
      return {
        error: "目標班級或當前班級不屬於指定課程",
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

    // 重新驗證相關頁面
    revalidatePath(`/supadmin/${supadminId}/courseLists/${CourseId}`);

    // 返回成功結果
    return {
      data: leave_data,
      success: "請假記錄創建成功",
    };
  } catch (error: any) {
    console.error("創建請假記錄失敗:", error.message, error.stack);
    return {
      error: "創建請假記錄失敗，請檢查輸入數據",
    };
  }
};

export const SupLeave_Student_Action = CreateSafeAction(SupLeave_Student_schema, handler);
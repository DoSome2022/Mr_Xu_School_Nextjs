// actions/Leave-Student/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Leave_Student_schema } from "./schema";
import { Leave } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, class_date, date, targetclassId, currentclassId, CourseId } = data;

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

    // 驗證 CourseId 是否存在
    const course = await db.course.findUnique({
      where: { id: CourseId },
    });
    if (!course) {
      return {
        error: "課程不存在",
      };
    }

    // 驗證 name 陣列中的學生是否存在
    for (const studentName of name) {
      const student = await db.student.findFirst({
        where: { name: studentName },
      });
      if (!student) {
        return {
          error: `學生 ${studentName} 不存在`,
        };
      }
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

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Leave_Data -- : ", leave_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath("/admin/leaves");
    revalidatePath(`/admin/courseLists/${CourseId}/classLists/${targetclassId}`);

    return { data: leave_data, success: "請假記錄創建成功" };
  } catch (error: any) {
    console.error("創建請假記錄失敗:", error);
    return {
      error: error.message || "創建請假記錄失敗，請檢查輸入數據",
    };
  }
};

export const Leave_Student_Action = CreateSafeAction(Leave_Student_schema, handler);
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { ChangeClass_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    studentId,
    targetclassId,
    currentclassId,
    class_date,
    name,
    student_class_date,
    courseId,
  } = data;

  try {
    // 使用 Prisma 交易確保所有操作原子化
    const result = await db.$transaction(async (prisma) => {
      // 1. 創建 ChangeClass 記錄
      const changeClass = await prisma.changeClass.create({
        data: {
          targetclassId,
          currentclassId,
          date: class_date,
          name,
          class_date: student_class_date,
        },
      });

      // 2. 更新原本的班級（targetclassId）
      const targetClass = await prisma.class.findUnique({
        where: { id: targetclassId },
      });

      if (!targetClass) {
        throw new Error(`找不到原本的班級 ID: ${targetclassId}`);
      }

      await prisma.class.update({
        where: { id: targetclassId },
        data: {
          persons: { decrement: 1 },
          node: { decrement: 1 },
        },
      });

      // 3. 從學生的 student_class 中移除原本的班級
      await prisma.student.update({
        where: { id: studentId },
        data: {
          student_class: {
            disconnect: { id: targetclassId },
          },
        },
      });

      // 4. 更新目標班級（currentclassId）
      const currentClass = await prisma.class.findUnique({
        where: { id: currentclassId },
      });

      if (!currentClass) {
        throw new Error(`找不到目標班級 ID: ${currentclassId}`);
      }

      await prisma.class.update({
        where: { id: currentclassId },
        data: {
          persons: { increment: 1 },
          node: { increment: 1 },
        },
      });

      // 5. 為學生的 student_class 添加目標班級
      await prisma.student.update({
        where: { id: studentId },
        data: {
          student_class: {
            connect: { id: currentclassId },
          },
        },
      });

      return changeClass;
    });

    console.log("-- ChangeClass Created -- : ", result, " -- End -- ");

    // 重新驗證路徑以更新頁面數據
    revalidatePath(`/admin/courseLists/${courseId}/classLists/${targetclassId}`);
    revalidatePath(`/admin/courseLists/${courseId}/classLists/${currentclassId}`);


  } catch (error) {
    console.error("-- ChangeClass Error -- : ", error, " -- End -- ");
    return {
      error: "創建調堂記錄失敗，請稍後重試。",
    };
  }
      // 重定向到班級詳情頁
      return redirect(`/admin/courseLists/${courseId}/classLists/${targetclassId}`);
};

export const createChangeClass = CreateSafeAction(ChangeClass_Create_Schema, handler);
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Teacher_upload_node_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { Teacher_upload_node } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, title, subject, answer, img, author, lesson, grade, language, teacherId } = data;

  let teacher_upload_node_data: Teacher_upload_node | undefined;

  try {
    // 驗證 teacherId 是否有效
    const teacher = await db.staffUser.findUnique({ where: { id: teacherId } });
    if (!teacher) {
      return { error: "指定的教師不存在" };
    }

    // 檢查 teacher.username 是否為 null
    if (!teacher.username) {
      return { error: "教師的用戶名未設置" };
    }

    // 驗證 author 是否有效
    const authorExists = await db.staffUser.findFirst({ where: { username: author } });
    if (!authorExists || !authorExists.username) {
      return { error: "指定的作者不存在或用戶名未設置" };
    }

    teacher_upload_node_data = await db.teacher_upload_node.create({
      data: {
        name,
        title,
        subject,
        answer,
        img,
        author,
        lesson,
        grade,
        language,
        teacher: teacher.username, // 使用非空的 username
        teacher_data: { connect: { id: teacherId } }, // 關聯 StaffUser 模型
      },
    });

    // 重新驗證相關頁面（假設為教師上傳節點列表）
    revalidatePath("/admin/teacherUploadNodes");

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- teacher_upload_node_Data -- : ", teacher_upload_node_data, " -- End -- ");
    }

    // 重定向到教師上傳節點列表（可根據需求調整路徑）
    redirect("/admin/teacherUploadNodes");

    return { data: teacher_upload_node_data };
  } catch (error) {
    console.error("創建教師上傳節點失敗:", error);
    return { error: "無法創建教師上傳節點，請檢查輸入數據" };
  }
};

export const createTeacherUploadNode = CreateSafeAction(Teacher_upload_node_Create_Schema, handler);
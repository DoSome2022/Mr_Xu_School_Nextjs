"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Apply_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

// 擴展 ReturnType 以包含 redirectTo
interface ExtendedReturnType {
  data?: any;
  error?: string;
  redirectTo?: string;
}

const handler = async (data: InputType): Promise<ExtendedReturnType> => {
  const { apply, apply_student_id, product_id, username, parentId } = data;

  let Apply_data;

  try {
    // 查詢學生及其家長資料
    const student = await db.student.findUnique({
      where: { id: apply_student_id },
      include: {
        Parent_data: true,
      },
    });

    if (!student) {
      return { error: "找不到學生" };
    }

    // 查詢產品
    const product = await db.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      return { error: "找不到產品" };
    }

    // 生成標題
    const parentName = student.Parent_data?.nickname || "未知家長";
    const currentDate = new Date().toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const title = `${parentName}的${student.name} ${currentDate}`;

    // 生成內容
    const content = product.description;

    // 主題
    const subject = `申請`;

    // 創建 Apply 記錄
    Apply_data = await db.apply.create({
      data: {
        title,
        subject,
        content,
        apply,
        apply_student_id,
        product_id,
        username,
      },
    });

    console.log("-- Apply_Data -- : ", Apply_data, " -- End -- ");

    // 返回數據和導航指令

  } catch (error) {
    console.error("創建 Apply 失敗:", error);
    return { error: "無法創建 Apply" };
  }

  return  redirect(`/parent/${parentId}/`);
};

export const createApply = CreateSafeAction(Apply_Create_Schema, handler);
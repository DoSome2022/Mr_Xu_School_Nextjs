"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Node_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { Node } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    title,
    subject,
    author,
    img,
    answer,
    node_lesson,
    grade,
    language,
    teacher,
  } = data;

  let node_data: Node | undefined;

  try {
    node_data = await db.node.create({
      data: {
        name,
        title,
        subject,
        author,
        img,
        answer,
        node_lesson,
        grade,
        language,
        teacher: [teacher], // 將單個 teacher 轉為陣列
      },
    });

    // 重新驗證相關頁面（假設為節點列表）
    revalidatePath("/admin/nodeLists");

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- node_Data -- : ", node_data, " -- End -- ");
    }

    // 重定向到節點列表（可根據需求調整路徑）
    redirect("/admin/nodeLists");

    return { data: node_data };
  } catch (error) {
    console.error("創建節點失敗:", error);
    return { error: "無法創建節點記錄，請檢查輸入數據" };
  }
};

export const createNode = CreateSafeAction(Node_Create_Schema, handler);
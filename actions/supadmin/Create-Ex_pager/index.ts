// actions/supadmin/Create-Ex_pager/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupEx_pager_Create_Schema } from "./schema";
import OSS from "ali-oss";

    // 初始化 OSS client
    const ossClient = new OSS({
      region: process.env.ALIBABA_CLOUD_OSS_REGION!,
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
      bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET!,
      endpoint: process.env.ALIBABA_CLOUD_OSS_ENDPOINT,
    });

const handler = async (data: InputType): Promise<ReturnType> => {
  const { supadminid, name, img, school_ex_pager_id, school_name, subject, grade, year, quarter } = data;

  let ex_pager_Data;

  try {
    // 處理 Base64 文件
    if (!img || !img.startsWith("data:")) {
      return { error: "無效的文件格式" };
    }

    // 解析 Base64 和 MIME 類型
    const matches = img.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return { error: "無效的 Base64 字符串" };
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, "base64");

    // 根據 MIME 類型決定副檔名
    let fileExtension: string;
    switch (mimeType) {
      case "image/jpeg":
      case "image/jpg":
        fileExtension = ".jpg";
        break;
      case "image/png":
        fileExtension = ".png";
        break;
      case "application/pdf":
        fileExtension = ".pdf";
        break;
      default:
        return { error: "不支援的文件類型，僅支援 JPG、PNG 和 PDF" };
    }

    // 生成唯一文件名
    const safeFileName = `${school_ex_pager_id}_${Date.now()}${fileExtension}`;
    const ossPath = `Uploads/ex_pagers/${safeFileName}`;

    // 上傳到阿里雲 OSS
    const ossResult = await ossClient.put(ossPath, buffer);
    const ossUrl = ossResult.url;

    // 儲存到資料庫
    ex_pager_Data = await db.ex_pager.create({
      data: {
        name,
        img: ossUrl, // 儲存 OSS URL
        school_ex_pager_id,
        school_name,
        subject,
        grade,
        year,
        quarter,
      },
    });

    revalidatePath(`/supadmin/${supadminid}/schoolLists/${school_ex_pager_id}/expageLists/`);
    return { success: "考試試卷創建成功", data: ex_pager_Data };
  } catch (error) {
    console.error("創建考試試卷錯誤:", error);
    return { error: error instanceof Error ? error.message : "伺服器錯誤，請稍後再試" };
  }
};

export const SupcreateExPager = CreateSafeAction(SupEx_pager_Create_Schema, handler);
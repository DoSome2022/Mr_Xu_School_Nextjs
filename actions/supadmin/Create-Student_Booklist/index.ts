"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_booklist_Create_Schema } from "./schema";
import { revalidatePath } from "next/cache";
import OSS from "ali-oss";
import { student_booklist } from "@prisma/client";

const getExtensionFromMime = (mimeType: string): string => {
  const mimeToExtension: { [key: string]: string } = {
    "application/pdf": ".pdf",
    "image/jpeg": ".jpg",
    "image/png": ".png",
  };
  return mimeToExtension[mimeType.toLowerCase()] || ".jpg"; // 默認圖片類型
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    studentId,
    parentId,
    name,
    img,
    student_booklist_id,
    student_name,
    grade,
    year,
    school,
  } = data;

  let student_booklist_Data: student_booklist;

  try {
    if (!img) {
      return { error: "缺少圖片或文件" };
    }

    // 解析 MIME type 從 base64
    const matches = img.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return { error: "無效的 Base64 數據" };
    }
    const mimeType = matches[1].toLowerCase();
    const extension = getExtensionFromMime(mimeType);

    // 轉換 base64 為 Buffer
    const buffer = Buffer.from(matches[2], "base64");

    // 初始化 OSS client
    const client = new OSS({
      region: process.env.ALIBABA_CLOUD_OSS_REGION!,
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
      bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET!,
      endpoint: process.env.ALIBABA_CLOUD_OSS_ENDPOINT,
    });

    // 生成唯一檔案名
    const safeFileName = `Uploads/${Date.now()}_${name.replace(/\s+/g, "_")}${extension}`;

    // 上傳到 OSS
    const result = await client.put(safeFileName, buffer, {
      mime: mimeType,
    });

    // 獲取 OSS URL，強制 HTTPS
    const ossUrl = result.url.replace("http://", "https://");

    // 存入資料庫，使用 OSS URL 替換 img
    student_booklist_Data = await db.student_booklist.create({
      data: {
        name,
        img: ossUrl,
        student_booklist_id,
        student_name,
        grade,
        year,
        school,
      },
    });

    // 重新驗證路徑
    revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${studentId}/bookLists`);

    // 返回符合 ActionState 的物件
    return {
      data: student_booklist_Data,
      success: true,
      parentid: parentId,
      student_booklist_id,
    };
  } catch (error) {
    let errorMessage = "上傳或創建失敗，請檢查輸入數據或文件格式";
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    console.error("上傳或創建失敗:", errorMessage);
    return { error: errorMessage };
  }
};

export const SupcreateStudentBookList = CreateSafeAction(Supstudent_booklist_Create_Schema, handler);
// "use server";

// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Supstudent_booklist_Create_Schema } from "./schema";
// import { revalidatePath } from "next/cache";
// import OSS from "ali-oss";
// import { student_booklist } from "@prisma/client";

// const getExtensionFromMime = (mimeType: string): string => {
//   if (mimeType === "application/pdf") return ".pdf";
//   if (mimeType === "image/jpeg") return ".jpg";
//   if (mimeType === "image/png") return ".png";
//   return ".jpg"; // 默認圖片類型
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const {
//     studentId,
//     parentId,
//     name,
//     img, // base64 字符串
//     student_booklist_id,
//     student_name,
//     grade,
//     year,
//     school,
//   } = data;

//   let student_booklist_Data: student_booklist;

//   try {
//     if (!img) {
//       return { error: "缺少圖片或文件" };
//     }

//     // 解析 MIME type 從 base64
//     const mimeType = img.split(";")[0].split(":")[1];
//     const extension = getExtensionFromMime(mimeType);

//     // 轉換 base64 為 Buffer
//     const buffer = Buffer.from(img.split(",")[1], "base64");

//     // 初始化 OSS client
//     const client = new OSS({
//       region: process.env.ALIBABA_CLOUD_OSS_REGION!,
//       accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
//       accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
//       bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET!,
//       endpoint: process.env.ALIBABA_CLOUD_OSS_ENDPOINT, // 可選
//     });

//     // 生成唯一檔案名
//     const safeFileName = `${Date.now()}_${name.replace(/\s+/g, "_")}${extension}`;

//     // 上傳到 OSS
//     const result = await client.put(safeFileName, buffer, {
//       mime: mimeType, // 設定 Content-Type
//     });

//     // 獲取 OSS URL
//     const ossUrl = result.url;

//     // 存入資料庫，使用 OSS URL 替換 img
//     student_booklist_Data = await db.student_booklist.create({
//       data: {
//         name,
//         img: ossUrl,
//         student_booklist_id,
//         student_name,
//         grade,
//         year,
//         school,
//       },
//     });

//     // 重新驗證路徑
//     revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${studentId}/bookLists`);

//     // 返回符合 ActionState 的物件
//     return {
//       data: student_booklist_Data, // 將資料放入 data 字段
//       success: true, // success 為布林值，指示操作成功
//       parentid: parentId, // 返回 parentId 以便 client-side 跳轉
//       student_booklist_id: student_booklist_id, // 返回 student_booklist_id
//     };
//   } catch (error) {
//     console.error("上傳或創建失敗:", error);
//     return { error: "上傳或創建失敗，請檢查日誌" };
//   }
// };

// export const SupcreateStudentBookList = CreateSafeAction(Supstudent_booklist_Create_Schema, handler);
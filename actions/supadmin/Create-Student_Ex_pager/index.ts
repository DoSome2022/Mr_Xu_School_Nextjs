"use server";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_ex_paper_Create_Schema } from "./schema";
import { revalidatePath } from "next/cache";
import OSS from "ali-oss";

// 初始化 OSS client
const client = new OSS({
  region: process.env.ALIBABA_CLOUD_OSS_REGION!,
  accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
  accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
  bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET!,
  endpoint: process.env.ALIBABA_CLOUD_OSS_ENDPOINT,
});

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    img, // base64 字符串
    student_ex_paper_id,
    student_name,
    subject,
    grade,
    year,
    quarter,
    school,
    parentId,
  } = data;

  let student_ex_paper_Data;
  let uploadedImgUrl = ""; // 預設空 URL

  try {
    if (img) {
      // 解析 base64 字符串以獲取 MIME type 和數據
      const [mime, base64Data] = img.split(';base64,');
      const mimeType = mime.split(':')[1]; // e.g., 'application/pdf'

      // 根據 MIME type 決定 extension
      let fileExtension: string;
      if (mimeType === 'application/pdf') {
        fileExtension = '.pdf';
      } else if (mimeType === 'image/jpeg') {
        fileExtension = '.jpg';
      } else if (mimeType === 'image/png') {
        fileExtension = '.png';
      } else {
        throw new Error('不支援的檔案類型。僅支援 PDF、JPG 或 PNG。');
      }

      // 生成時間戳記（格式：YYYYMMDDHHMMSS）
      const now = new Date();
      const timestamp = now.toISOString() // e.g., "2025-10-05T02:23:45.123Z"
        .replace(/[-:T]/g, '') // 移除連字符、冒號和 T
        .slice(0, 14); // 取 YYYYMMDDHHMMSS（14 位）
      
      // 生成安全檔案名（時間戳記 + extension）
      const safeFileName = `${timestamp}${fileExtension}`; // e.g., "20251005102345.pdf"

      // 轉換 base64 為 Buffer
      const buffer = Buffer.from(base64Data, 'base64');

      // 上傳到 OSS（假設儲存路徑為 'uploads/' + safeFileName）
      const result = await client.put(`uploads/${safeFileName}`, buffer);

      // 獲取上傳後的 URL
      uploadedImgUrl = result.url;
    }

    // 創建資料庫記錄，使用 OSS URL 作為 img
    student_ex_paper_Data = await db.student_ex_paper.create({
      data: {
        name: name,
        img: uploadedImgUrl, // 使用 OSS URL
        student_ex_paper_id: student_ex_paper_id,
        student_name: student_name,
        subject: subject,
        grade: grade,
        year: year,
        quarter: quarter,
        school: school,
      },
    });

    // 重新驗證路徑
    revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_ex_paper_id}/expageLists/`);

    console.log("-- student_ex_paper_Data -- : ", student_ex_paper_Data, " -- End -- ");

    return { data: student_ex_paper_Data, success: "考試試卷創建成功" };
  } catch (error) {
    console.error("創建錯誤:", error);
    const errorMessage = error instanceof Error ? error.message : "發生未知錯誤";
    return { error: errorMessage };
  }
};

export const SupcreateStudentExPaper = CreateSafeAction(Supstudent_ex_paper_Create_Schema, handler);
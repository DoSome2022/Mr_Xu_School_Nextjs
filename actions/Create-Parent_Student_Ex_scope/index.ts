"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_ex_scope_create_schema } from "./schema";
import OSS from "ali-oss";

// 定義環境變數的類型
interface OSSConfig {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  endpoint?: string;
}

// 檢查環境變數
const getOSSConfig = (): OSSConfig => {
  const region = process.env.ALIBABA_CLOUD_OSS_REGION;
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
  const bucket = process.env.ALIBABA_CLOUD_OSS_BUCKET;
  const endpoint = process.env.ALIBABA_CLOUD_OSS_ENDPOINT;

  if (!region || !accessKeyId || !accessKeySecret || !bucket) {
    throw new Error(
      "Missing required OSS environment variables: ALIBABA_CLOUD_OSS_REGION, ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET, or ALIBABA_CLOUD_OSS_BUCKET"
    );
  }

  return {
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    endpoint,
  };
};

// 處理不同類型文件的函數
const processUploadedFile = (fileData: string, originalFileName: string) => {
  const base64Content = fileData.split(";base64,").pop();
  if (!base64Content) {
    throw new Error("Invalid file format");
  }

  const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";
  const buffer = Buffer.from(base64Content, "base64");

  return { buffer, fileExtension };
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    img,
    student_ex_scope_id,
    student_name,
    grade,
    quarter,
    school,
    subject,
    parentid,
    originalFileName,
  } = data;

  let parent_student_ex_scope_Data;

  try {
    // 驗證 parentid 和 student_ex_scope_id
    const parent = await db.user.findUnique({ where: { id: parentid } });
    if (!parent) {
      return { error: "指定的家長不存在" };
    }

    const student = await db.student.findFirst({ where: { name: student_name } });
    if (!student) {
      return { error: "指定的學生不存在" };
    }

    let ossUrl = "/uploads/default.png"; // 默認圖片路徑

    if (img && originalFileName) {
      // 獲取 OSS 配置並初始化客戶端
      const ossConfig = getOSSConfig();
      const client = new OSS({
        region: ossConfig.region,
        accessKeyId: ossConfig.accessKeyId,
        accessKeySecret: ossConfig.accessKeySecret,
        bucket: ossConfig.bucket,
        endpoint: ossConfig.endpoint,
      });

      // 生成唯一的 OSS 對象名稱
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${quarter}-${school}`;
      const { buffer, fileExtension } = processUploadedFile(img, originalFileName);
      const objectKey = `uploads/${safeFileName}.${fileExtension}`;

      // 上傳到 OSS
      const result = await client.put(objectKey, buffer);
      ossUrl = result.url; // 公開 URL，例如 https://your-bucket.oss-cn-hongkong.aliyuncs.com/uploads/xxx.jpg

      // 若 Bucket 為私有，改用簽名 URL（可選）
      // ossUrl = client.signatureUrl(objectKey, { expires: 3600 }); // 1 小時有效
    }

    parent_student_ex_scope_Data = await db.student_ex_scope.create({
      data: {
        name,
        img: ossUrl, // 存儲 OSS URL 或默認路徑
        student_ex_scope_id,
        student_name,
        grade,
        quarter,
        school,
        subject,
      },
    });

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- parent_student_ex_scope_Data -- : ", parent_student_ex_scope_Data, " -- End -- ");
    }

    // 返回成功結果和重定向所需的資料
    return {
      success: "true",
      data: parent_student_ex_scope_Data,
      parentid,
      student_ex_scope_id,
    };
  } catch (error) {
    console.error("創建學生試卷範圍記錄失敗:", error);
    return { error: "無法創建學生試卷範圍記錄，請檢查輸入數據" };
  }
};

export const createParentStudentExScope = CreateSafeAction(parent_student_ex_scope_create_schema, handler);
"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Booklist_Create_Schema } from "./schema";
import OSS from "ali-oss";
import { revalidatePath } from "next/cache";

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

// 處理圖片文件的函數
const processUploadedFile = (fileData: string, originalFileName: string) => {
  const base64Content = fileData.split(";base64,").pop();
  if (!base64Content) {
    throw new Error("Invalid file format");
  }

  const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";
  if (!["jpg", "jpeg", "png"].includes(fileExtension)) {
    throw new Error("僅支持 JPG、JPEG 或 PNG 格式的圖片");
  }

  const buffer = Buffer.from(base64Content, "base64");

  return { buffer, fileExtension };
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, img, school_booklist_id, school_name, grade, year } = data;

  let booklist_Data;

  try {
    // 驗證 school_booklist_id 和 school_name
    const school = await db.school.findUnique({ where: { id: school_booklist_id } });
    if (!school) {
      return { error: "指定的學校不存在" };
    }

    let ossUrl = "/Uploads/default.png"; // 默認圖片路徑

    if (img) {
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
      const safeFileName = `${timestamp}-${name}-${school_name}-${grade}-${year}`;
      const { buffer, fileExtension } = processUploadedFile(img, `${safeFileName}.jpg`); // 假設文件名
      const objectKey = `Uploads/${safeFileName}.${fileExtension}`;

      // 上傳到 OSS
      const result = await client.put(objectKey, buffer);
      ossUrl = result.url; // 公開 URL，例如 https://your-bucket.oss-cn-hongkong.aliyuncs.com/uploads/xxx.jpg

      // 若 Bucket 為私有，改用簽名 URL（可選）
      // ossUrl = client.signatureUrl(objectKey, { expires: 3600 }); // 1 小時有效
    }

    booklist_Data = await db.booklist.create({
      data: {
        name,
        img: ossUrl, // 存儲 OSS URL 或默認路徑
        school_booklist_id,
        school_name,
        grade,
        year,
      },
    });

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- booklist_Data -- : ", booklist_Data, " -- End -- ");
    }
    console.log("-- booklist_Data -- : ", booklist_Data, " -- End -- ");
    console.log("-- ossUrl -- : ", ossUrl, " -- End -- ");

    // 返回成功結果和重定向所需的資料
    return {
      success: "true",
      data: booklist_Data,
      school_booklist_id,
    };
    revalidatePath("")
  } catch (error) {
    console.error("創建書單記錄失敗:", error);
    return { error: "無法創建書單記錄，請檢查輸入數據或圖片格式" };
  }
};

export const createBooklist = CreateSafeAction(Booklist_Create_Schema, handler);
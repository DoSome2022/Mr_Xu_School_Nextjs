// "use server";

// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Ex_timetable_Create_Schema } from "./schema";
// import OSS from "ali-oss";

// // 定義環境變數的類型
// interface OSSConfig {
//   region: string;
//   accessKeyId: string;
//   accessKeySecret: string;
//   bucket: string;
//   endpoint?: string;
// }

// // 檢查環境變數
// const getOSSConfig = (): OSSConfig => {
//   const region = process.env.ALIBABA_CLOUD_OSS_REGION;
//   const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
//   const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
//   const bucket = process.env.ALIBABA_CLOUD_OSS_BUCKET;
//   const endpoint = process.env.ALIBABA_CLOUD_OSS_ENDPOINT;

//   if (!region || !accessKeyId || !accessKeySecret || !bucket) {
//     throw new Error(
//       "Missing required OSS environment variables: ALIBABA_CLOUD_OSS_REGION, ALIBABA_CLOUD_ACCESS_KEY_ID, ALIBABA_CLOUD_ACCESS_KEY_SECRET, or ALIBABA_CLOUD_OSS_BUCKET"
//     );
//   }

//   return {
//     region,
//     accessKeyId,
//     accessKeySecret,
//     bucket,
//     endpoint,
//   };
// };

// // 處理圖片/文件的函數
// const processUploadedFile = (fileData: string, originalFileName: string) => {
//   const base64Content = fileData.split(";base64,").pop();
//   if (!base64Content) {
//     throw new Error("Invalid file format");
//   }

//   const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";
//   if (!["jpg", "jpeg", "png", "pdf"].includes(fileExtension)) {
//     throw new Error("僅支持 JPG、JPEG、PNG 或 PDF 格式");
//   }

//   const buffer = Buffer.from(base64Content, "base64");

//   return { buffer, fileExtension };
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { name, img, school_ex_time_id, school_name, grade, year, quarter, subject } = data;

//   let ex_timetable_Data;

//   try {
//     // 驗證 school_ex_time_id 和 school_name
//     const school = await db.school.findUnique({ where: { id: school_ex_time_id } });
//     if (!school) {
//       return { error: "指定的學校不存在" };
//     }

//     let ossUrl = "/Uploads/default.png"; // 默認圖片路徑

//     if (img) {
//       // 獲取 OSS 配置並初始化客戶端
//       const ossConfig = getOSSConfig();
//       const client = new OSS({
//         region: ossConfig.region,
//         accessKeyId: ossConfig.accessKeyId,
//         accessKeySecret: ossConfig.accessKeySecret,
//         bucket: ossConfig.bucket,
//         endpoint: ossConfig.endpoint,
//       });

//       // 生成唯一的 OSS 對象名稱
//       const timestamp = Date.now();
//       const safeFileName = `${timestamp}-${name}-${school_name}-${subject}-${grade}-${year}-${quarter}`;
//       const { buffer, fileExtension } = processUploadedFile(img, `${safeFileName}."jpg"}`);
//       const objectKey = `Uploads/${safeFileName}.${fileExtension}`;

//       // 上傳到 OSS
//       const result = await client.put(objectKey, buffer);
//       ossUrl = result.url; // 公開 URL，例如 https://your-bucket.oss-cn-hongkong.aliyuncs.com/uploads/xxx.jpg

//       // 若 Bucket 為私有，改用簽名 URL（可選）
//       // ossUrl = client.signatureUrl(objectKey, { expires: 3600 }); // 1 小時有效
//     }

//     ex_timetable_Data = await db.ex_timetable.create({
//       data: {
//         name,
//         img: ossUrl, // 存儲 OSS URL 或默認路徑
//         school_ex_time_id,
//         school_name,
//         grade,
//         year,
//         quarter,
//         subject,
//       },
//     });

//     // 記錄成功創建（僅用於開發環境）
//     if (process.env.NODE_ENV === "development") {
//       console.log("-- ex_timetable_Data -- : ", ex_timetable_Data, " -- End -- ");
//     }

//     // 返回成功結果和重定向所需的資料
//     return {
//       success: "true",
//       data: ex_timetable_Data,
//       school_ex_time_id,
//     };
//   } catch (error) {
//     console.error("創建考試時間表記錄失敗:", error);
//     return { error: "無法創建考試時間表記錄，請檢查輸入數據或文件格式" };
//   }
// };

// export const createExTimeTable = CreateSafeAction(Ex_timetable_Create_Schema, handler);


// actions/Create-Ex_timetable/index.ts
"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Ex_timetable_Create_Schema } from "./schema";
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

// 處理圖片/文件的函數
const processUploadedFile = (fileData: string, originalFileName: string) => {
  const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || !matches[1] || !matches[2]) {
    throw new Error("無效的 Base64 數據");
  }

  const mimeType = matches[1].toLowerCase();
  const validMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!validMimeTypes.includes(mimeType)) {
    throw new Error("僅支持 JPG、JPEG、PNG 或 PDF 格式");
  }

  const base64Content = matches[2];
  const buffer = Buffer.from(base64Content, "base64");

  // 使用原始文件名提取擴展名進行驗證
  const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";
  const expectedExtension = {
    "image/jpeg": ["jpg", "jpeg"],
    "image/png": ["png"],
    "application/pdf": ["pdf"],
  }[mimeType];

  if (!expectedExtension || !expectedExtension.includes(fileExtension)) {
    throw new Error(`文件擴展名與 MIME 類型不匹配，應為 ${expectedExtension?.join(" 或 ")}`);
  }

  return { buffer, fileExtension };
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const { name, img, school_ex_time_id, school_name, grade, year, quarter, subject, originalFileName } = data;

  let ex_timetable_Data;

  try {
    // 驗證 school_ex_time_id 和 school_name
    const school = await db.school.findUnique({ where: { id: school_ex_time_id } });
    if (!school) {
      return { error: "指定的學校不存在" };
    }

    let ossUrl = "/Uploads/default.png"; // 默認圖片路徑

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
      const safeFileName = `${timestamp}-${name}-${school_name}-${subject}-${grade}-${year}-${quarter}`;
      const { buffer, fileExtension } = processUploadedFile(img, originalFileName);
      const objectKey = `Uploads/${safeFileName}.${fileExtension}`;

      // 上傳到 OSS
      const result = await client.put(objectKey, buffer);
      ossUrl = result.url; // 公開 URL，例如 https://your-bucket.oss-cn-hongkong.aliyuncs.com/uploads/xxx.jpg
    }

    ex_timetable_Data = await db.ex_timetable.create({
      data: {
        name,
        img: ossUrl, // 存儲 OSS URL 或默認路徑
        school_ex_time_id,
        school_name,
        grade,
        year,
        quarter,
        subject,
      },
    });

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- ex_timetable_Data -- : ", ex_timetable_Data, " -- End -- ");
    }

    // 返回成功結果和重定向所需的資料
    return {
      success: "true",
      data: ex_timetable_Data,
      school_ex_time_id,
    };
  } catch (error) {
    // 類型縮窄：檢查 error 是否為 Error 實例
    let errorMessage = "無法創建考試時間表記錄，請檢查輸入數據或文件格式";
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      console.error("未知錯誤類型:", error);
    }
    console.error("創建考試時間表記錄失敗:", errorMessage);
    return { error: errorMessage };
  }
};

export const createExTimeTable = CreateSafeAction(Ex_timetable_Create_Schema, handler);
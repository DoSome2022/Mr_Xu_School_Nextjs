"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_booklist_create_schema } from "./schema";
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
    student_booklist_id,
    student_name,
    grade,
    year,
    school,
    parentid,
    originalFileName,
  } = data;

  let parent_student_booklist_Data;
  let ossUrl: string | undefined;

  try {
    const ossConfig = getOSSConfig();
    const client = new OSS({
      region: ossConfig.region,
      accessKeyId: ossConfig.accessKeyId,
      accessKeySecret: ossConfig.accessKeySecret,
      bucket: ossConfig.bucket,
      endpoint: ossConfig.endpoint,
    });

    if (img) {
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
      const { buffer, fileExtension } = processUploadedFile(img, originalFileName || "upload");
      const objectKey = `uploads/${safeFileName}.${fileExtension}`;

      const result = await client.put(objectKey, buffer);
      ossUrl = result.url;

      parent_student_booklist_Data = await db.student_booklist.create({
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
    } else {
      parent_student_booklist_Data = await db.student_booklist.create({
        data: {
          name,
          student_booklist_id,
          student_name,
          grade,
          year,
          school,
        },
      });
    }

    return {
      success: true, // 修改回布林值
      data: parent_student_booklist_Data,
      parentid,
      student_booklist_id,

    };
      //刷新緩存
    // revalidatePath(`/parent/${parentid}/profiles/${student_booklist_id}/upload/bookLists`);

  } catch (error) {
    console.error("Error processing upload to OSS:", error);
    return {
      success: false, // 修改回布林值
      error: "Failed to process file upload to OSS",
    };
  }
};

export const createparentstudentbooklist = CreateSafeAction(parent_student_booklist_create_schema, handler);
// "use server";

// import { revalidatePath } from "next/cache";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { parent_student_booklist_create_schema } from "./schema";
// import { redirect } from "next/navigation";
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
//     endpoint, // endpoint 是可選的
//   };
// };

// // 處理不同類型文件的函數
// const processUploadedFile = (fileData: string, originalFileName: string) => {
//   // 移除 base64 前綴 (data:image/jpeg;base64, 或其他 MIME 類型)
//   const base64Content = fileData.split(";base64,").pop();
//   if (!base64Content) {
//     throw new Error("Invalid file format");
//   }

//   // 從原始文件名中提取擴展名
//   const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";
//   const buffer = Buffer.from(base64Content, "base64");

//   return { buffer, fileExtension };
// };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const {
//     name,
//     img, // base64 字符串
//     student_booklist_id,
//     student_name,
//     grade,
//     year,
//     school,
//     parentid,
//     originalFileName, // 原始文件名
//   } = data;

//   let parent_student_booklist_Data;
//   let ossUrl: string | undefined;

//   try {
//     // 獲取 OSS 配置並初始化客戶端
//     const ossConfig = getOSSConfig();
//     const client = new OSS({
//       region: ossConfig.region,
//       accessKeyId: ossConfig.accessKeyId,
//       accessKeySecret: ossConfig.accessKeySecret,
//       bucket: ossConfig.bucket,
//       endpoint: ossConfig.endpoint,
//     });

//     // 如果有文件上傳
//     if (img) {
//       // 生成唯一的 OSS 對象名稱（object key）
//       const timestamp = Date.now();
//       const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
//       const { buffer, fileExtension } = processUploadedFile(img, originalFileName || "upload");
//       const objectKey = `uploads/${safeFileName}.${fileExtension}`; // OSS 中的路徑，例如 uploads/xxx.jpg

//       // 上傳到 OSS
//       const result = await client.put(objectKey, buffer);

//       // 生成公開 URL（假設 Bucket 為公開讀取；若需簽名 URL，可使用 client.signatureUrl）
//       ossUrl = result.url;

//       // 創建數據庫記錄
//       parent_student_booklist_Data = await db.student_booklist.create({
//         data: {
//           name,
//           img: ossUrl, // 存儲 OSS URL
//           student_booklist_id,
//           student_name,
//           grade,
//           year,
//           school,
//         },
//       });
//     } else {
//       // 如果沒有文件上傳
//       parent_student_booklist_Data = await db.student_booklist.create({
//         data: {
//           name,
//           student_booklist_id,
//           student_name,
//           grade,
//           year,
//           school,
//         },
//       });
//     }

//     // 刷新緩存
//     revalidatePath(`/parent/${parentid}/profiles/${student_booklist_id}/upload/bookLists`);
//   } catch (error) {
//     console.error("Error processing upload to OSS:", error);
//     throw new Error("Failed to process file upload to OSS");
//   }

//   console.log("-- parent_student_booklist_Data -- : ", parent_student_booklist_Data, " -- End -- ");
//   return redirect(`/parent/${parentid}/profiles/${student_booklist_id}/upload/bookLists`);
// };

// export const createparentstudentbooklist = CreateSafeAction(parent_student_booklist_create_schema, handler);
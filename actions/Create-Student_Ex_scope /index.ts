// "use server";
 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { student_ex_scope_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {
//             name,
//             img,
//             student_ex_scope_id,
//             student_name,
//             grade,
//             quarter,
//             school,
//             subject,
//             parentId,
//         } = data;

//     let student_ex_scope_Data;

//     try {
//         student_ex_scope_Data = await db.student_ex_scope.create({
//             data:{
//                 name : name,
//                 img : img,
//                 student_ex_scope_id : student_ex_scope_id,
//                 student_name : student_name,
//                 grade : grade,
//                 quarter : quarter,
//                 school : school,
//                 subject : subject
//             }
//         });
//         revalidatePath(`/admin/userLists/parentsLists/${parentId}/studentLists/${student_ex_scope_id}/exscopeLists`)
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- student_ex_scope_Data -- : " , student_ex_scope_Data , " -- End -- ")
//     return redirect(`/admin/userLists/parentsLists/${parentId}/studentLists/${student_ex_scope_id}/exscopeLists`)
// }

// export const createStudentExScope = CreateSafeAction(student_ex_scope_Create_Schema, handler)


"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { student_ex_scope_Create_Schema } from "./schema";
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

// 處理圖片/文件的函數
const processUploadedFile = (fileData: string) => {
  // 從 Base64 字串中提取 MIME 類型和內容
  const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error("無效的 Base64 數據");
  }

  const mimeType = matches[1].toLowerCase();
  const base64Content = matches[2];

  // 根據 MIME 類型映射副檔名
  const mimeToExtension: { [key: string]: string } = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "application/pdf": "pdf",
  };

  // 提取 MIME 類型對應的副檔名
  const fileExtension = mimeToExtension[mimeType];
  if (!fileExtension) {
    throw new Error("僅支持 JPG、JPEG、PNG 或 PDF 格式");
  }

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
    parentId,
  } = data;

  let student_ex_scope_Data;

  try {
    // 驗證 student_ex_scope_id
    const student = await db.student.findUnique({ where: { id: student_ex_scope_id } });
    if (!student) {
      return { error: "指定的學生不存在" };
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
      const safeFileName = `${timestamp}-${name}-${student_name}-${school}-${subject}-${grade}-${quarter}`;
      const { buffer, fileExtension } = processUploadedFile(img); // 動態獲取副檔名
      const objectKey = `Uploads/${safeFileName}.${fileExtension}`;

      // 上傳到 OSS
      const result = await client.put(objectKey, buffer);
      ossUrl = result.url.replace("http://", "https://"); // 強制使用 HTTPS

      // 若 Bucket 為私有，改用簽名 URL（可選）
      // ossUrl = client.signatureUrl(objectKey, { expires: 3600 }); // 1 小時有效
    }

    student_ex_scope_Data = await db.student_ex_scope.create({
      data: {
        name,
        img: ossUrl, // 儲存 OSS URL 或默認路徑
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
      console.log("-- student_ex_scope_Data -- : ", student_ex_scope_Data, " -- End -- ");
      console.log("-- ossUrl -- : ", ossUrl, " -- End -- ");
    }

    // 返回成功結果
    return {
      data: student_ex_scope_Data,
      student_ex_scope_id,
    };
  } catch (error) {
    // 類型縮窄：檢查 error 是否為 Error 實例
    let errorMessage = "無法創建學生學習範圍記錄，請檢查輸入數據或文件格式";
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    } else if (typeof error === "string") {
      errorMessage = error;
    } else {
      console.error("未知錯誤類型:", error);
    }
    console.error("創建學生學習範圍記錄失敗:", errorMessage);
    return { error: errorMessage };
  } finally {
    revalidatePath(`/admin/userLists/parentsLists/${parentId}/studentLists/${student_ex_scope_id}/exscopeLists`);
  }
};

export const createStudentExScope = CreateSafeAction(student_ex_scope_Create_Schema, handler);
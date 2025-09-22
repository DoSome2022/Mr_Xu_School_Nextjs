// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { parent_student_ex_pager_create_schema } from "./schema";
// import { redirect } from 'next/navigation'
// import { writeFile } from "fs/promises";
// import { join } from "path";

// // 處理不同類型文件的函數
// const processUploadedFile = (fileData: string, originalFileName: string) => {
//     // 移除 base64 前綴 (data:image/jpeg;base64, 或其他 MIME 類型)
//     const base64Content = fileData.split(';base64,').pop();
//     if (!base64Content) {
//         throw new Error("Invalid file format");
//     }

//     // 從原始文件名中提取擴展名
//     const fileExtension = originalFileName.split('.').pop()?.toLowerCase() || '';
//     const buffer = Buffer.from(base64Content, 'base64');
    
//     return { buffer, fileExtension };
// };
// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {
//             name,
//             img,
//             student_ex_paper_id,
//             student_name,
//             grade,
//             quarter,
//             school,
//             year,
//             subject,
//             parentid,
//             originalFileName // 添加原始文件名作為參數
//         } = data;

//     let parent_student_ex_pager_Data;
//     let filePath;


//     try {
//         if (img) {
//                         // 生成唯一的文件名
//                         const timestamp = Date.now();
//                         const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
                        
//                         // 處理上傳的文件
//                         const { buffer, fileExtension } = processUploadedFile(img, originalFileName || 'upload');
                        
//                         // 確定文件存儲路徑
//                         const fileNameWithExt = `${safeFileName}.${fileExtension}`;
//                         filePath = join(process.cwd(), "public", "uploads", fileNameWithExt);
            
//                         // 寫入文件
//                         await writeFile(filePath, buffer);
                        
//                         // 存儲相對路徑到數據庫
//                         const relativePath = `/uploads/${fileNameWithExt}`;

//         parent_student_ex_pager_Data = await db.student_ex_paper.create({
//             data:{
//                 name : name,
//                 img : relativePath,
//                 student_ex_paper_id : student_ex_paper_id,
//                 student_name : student_name,
//                 grade : grade,
//                 quarter : quarter,
//                 school : school,
//                 year:year,
//                 subject:subject
//             }
//         });

//         } else {
//             parent_student_ex_pager_Data = await db.student_ex_paper.create({
//                 data:{
//                     name,
//                     student_ex_paper_id ,
//                     student_name ,
//                     grade ,
//                     quarter ,
//                     school ,
//                     year,
//                     subject
//                 }
//             });
//         }

// revalidatePath(`/parent/${parentid}/profiles/${student_ex_paper_id}/upload/expageLists`);


//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- parent_student_ex_pager_Data -- : " , parent_student_ex_pager_Data , " -- End -- ")
//     return redirect(`/parent/${parentid}/profiles/${student_ex_paper_id}/upload/expageLists`)
// }

// export const createparentstudentexpager = CreateSafeAction(parent_student_ex_pager_create_schema, handler)


"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_ex_pager_create_schema } from "./schema";
import OSS from "ali-oss";
import { student_ex_paper } from "@prisma/client";

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
    throw new Error("無效的檔案格式");
  }

  const fileExtension = originalFileName.split(".").pop()?.toLowerCase() || "";
  const buffer = Buffer.from(base64Content, "base64");

  return { buffer, fileExtension };
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    img,
    student_ex_paper_id,
    student_name,
    grade,
    quarter,
    school,
    year,
    subject,
    parentid,
    originalFileName,
  } = data;

  let parent_student_ex_pager_Data: student_ex_paper | undefined;

  try {
    // 驗證 parentid 和 student_ex_paper_id
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

      // 生成唯一的 OSS 對象名稱（object key）
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
      const { buffer, fileExtension } = processUploadedFile(img, originalFileName);
      const objectKey = `uploads/${safeFileName}.${fileExtension}`; // OSS 中的路徑，例如 uploads/xxx.jpg

      // 上傳到 OSS
      const result = await client.put(objectKey, buffer);

      // 生成公開 URL（假設 Bucket 為公開讀取；若需簽名 URL，可使用 client.signatureUrl）
      ossUrl = result.url;
    }

    parent_student_ex_pager_Data = await db.student_ex_paper.create({
      data: {
        name,
        img: ossUrl, // 存儲 OSS URL 或默認路徑
        student_ex_paper_id,
        student_name,
        grade,
        quarter,
        school,
        year,
        subject,
      },
    });

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- parent_student_ex_pager_Data -- : ", parent_student_ex_pager_Data, " -- End -- ");
    }

    // 返回成功結果和重定向所需的資料（客戶端將處理重定向和緩存刷新）
    return {
      success: "true",
      data: parent_student_ex_pager_Data,
      parentid,
      student_ex_paper_id,
    };
  } catch (error) {
    console.error("創建學生試卷記錄失敗:", error);
    return { error: "無法創建學生試卷記錄，請檢查輸入數據" };
  }
};

export const createparentstudentexpager = CreateSafeAction(parent_student_ex_pager_create_schema, handler);
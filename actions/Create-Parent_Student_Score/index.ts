// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { parent_student_score_create_schema } from "./schema";
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
//         student_name,
//         student_score_id,
//         subject,
//         grade,
//         score,
//         quarter,
//         school,
//         year,
//         name,
//         img,
//         parentid,
//         originalFileName // 添加原始文件名作為參數
//         } = data;

//     let parent_student_score_Data;
//     let filePath;

//     try {
//         if(img){
//             // 生成唯一的文件名
//             const timestamp = Date.now();
//             const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
            
//             // 處理上傳的文件
//             const { buffer, fileExtension } = processUploadedFile(img, originalFileName || 'upload');
            
//             // 確定文件存儲路徑
//             const fileNameWithExt = `${safeFileName}.${fileExtension}`;
//             filePath = join(process.cwd(), "public", "uploads", fileNameWithExt);

//             // 寫入文件
//             await writeFile(filePath, buffer);
            
//             // 存儲相對路徑到數據庫
//             const relativePath = `/uploads/${fileNameWithExt}`;

//         parent_student_score_Data = await db.student_score.create({
//             data:{
//                 student_name : student_name,
//                 student_score_id : student_score_id,
//                 subject : subject,
//                 grade : grade,
//                 score : score,
//                 quarter : quarter,
//                 year: year,
//                 school: school,
//                 name: name,
//                 img:relativePath,
//             }
//         });


//         }else{
//             parent_student_score_Data = await db.student_score.create({
//                 data:{
//                     student_name : student_name,
//                     student_score_id : student_score_id,
//                     subject : subject,
//                     grade : grade,
//                     score : score,
//                     quarter : quarter,
//                     year: year,
//                     school: school,
//                     name: name,
//                 }
//             });
//         }

//         // 刷新緩存
//         revalidatePath(`/parent/${parentid}/profiles/${student_score_id}/upload/scoreLists`);


//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- parent_student_score_Data -- : " , parent_student_score_Data , " -- End -- ")
//     return redirect(`/parent/${parentid}/profiles/${student_score_id}/upload/scoreLists`);
// }

// export const createParentStudentScore = CreateSafeAction(parent_student_score_create_schema, handler)

"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_score_create_schema } from "./schema";
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
    student_score_id,
    student_name,
    grade,
    year,
    quarter,
    school,
    subject,
    score,
    parentid,
    originalFileName,
  } = data;

  let parent_student_score_Data;

  try {
    // 驗證 parentid 和 student_name
    const parent = await db.user.findUnique({ where: { id: parentid } });
    if (!parent) {
      return { error: "指定的家長不存在" };
    }

    const student = await db.student.findFirst({ where: { name: student_name } });
    if (!student) {
      return { error: "指定的學生不存在" };
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
      const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${quarter}-${school}`;
      const { buffer, fileExtension } = processUploadedFile(img, originalFileName);
      const objectKey = `Uploads/${safeFileName}.${fileExtension}`;

      // 上傳到 OSS
      const result = await client.put(objectKey, buffer);
      ossUrl = result.url; // 公開 URL，例如 https://your-bucket.oss-cn-hongkong.aliyuncs.com/uploads/xxx.jpg

      // 若 Bucket 為私有，改用簽名 URL（可選）
      // ossUrl = client.signatureUrl(objectKey, { expires: 3600 }); // 1 小時有效
    }

    parent_student_score_Data = await db.student_score.create({
      data: {
        name,
        img: ossUrl, // 存儲 OSS URL 或默認路徑
        student_score_id,
        student_name,
        grade,
        year,
        quarter,
        school,
        subject,
        score,
      },
    });

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- parent_student_score_Data -- : ", parent_student_score_Data, " -- End -- ");
    }

    // 返回成功結果和重定向所需的資料
    return {
      success: "true",
      data: parent_student_score_Data,
      parentid,
      student_score_id,
    };
  } catch (error) {
    console.error("創建學生成績記錄失敗:", error);
    return { error: "無法創建學生成績記錄，請檢查輸入數據" };
  }
};

export const createParentStudentScore = CreateSafeAction(parent_student_score_create_schema, handler);
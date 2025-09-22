// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { parent_student_ex_timetable_create_schema } from "./schema";
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
//             student_ex_timetable_id,
//             student_name,
//             grade,
//             year,
//             quarter,
//             school,
//             subject,
//             parentid,
//             originalFileName // 添加原始文件名作為參數
//         } = data;

//     let parent_student_ex_timetable_Data;
//     let filePath;

//     try {

//         if(img) {

//                     // 生成唯一的文件名
//                     const timestamp = Date.now();
//                     const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
                    
//                     // 處理上傳的文件
//                     const { buffer, fileExtension } = processUploadedFile(img, originalFileName || 'upload');
                    
//                     // 確定文件存儲路徑
//                     const fileNameWithExt = `${safeFileName}.${fileExtension}`;
//                     filePath = join(process.cwd(), "public", "uploads", fileNameWithExt);
        
//                     // 寫入文件
//                     await writeFile(filePath, buffer);
                    
//                     // 存儲相對路徑到數據庫
//                     const relativePath = `/uploads/${fileNameWithExt}`;
        


//         parent_student_ex_timetable_Data = await db.student_ex_timetable.create({
//             data:{
//                 name : name,
//                 img : relativePath,
//                 student_ex_timetable_id : student_ex_timetable_id,
//                 student_name : student_name,
//                 grade : grade,
//                 year : year,
//                 quarter : quarter,
//                 school: school,
//                 subject: subject
//             }
//         });
//         } else {
//             parent_student_ex_timetable_Data = await db.student_ex_timetable.create({
//                 data:{
//                     name : name,
//                     student_ex_timetable_id : student_ex_timetable_id,
//                     student_name : student_name,
//                     grade : grade,
//                     year : year,
//                     quarter : quarter,
//                     school: school,
//                     subject: subject
//                 }
//             });
//         }
//         revalidatePath(`/parent/${parentid}/profiles/${student_ex_timetable_id}/upload/extimeLists`);


//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- parent_student_ex_timetable_Data -- : " , parent_student_ex_timetable_Data , " -- End -- ")
//     return redirect(`/parent/${parentid}/profiles/${student_ex_timetable_id}/upload/extimeLists`)
// }

// export const createParentStudentExTimeTable = CreateSafeAction(parent_student_ex_timetable_create_schema, handler)


"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_ex_timetable_create_schema } from "./schema";
import OSS from 'ali-oss';

// 配置阿里云 OSS 客户端
const configureOSSClient = () => {
  return new OSS({
    region: process.env.OSS_REGION, // 例如: 'oss-cn-hongkong'
    accessKeyId: process.env.OSS_ACCESS_KEY_ID!,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET!,
    bucket: process.env.OSS_BUCKET_NAME!,
  });
};

// 处理文件上传至 OSS
const uploadFileToOSS = async (fileBuffer: Buffer, fileName: string, mimeType?: string): Promise<string> => {
  const client = configureOSSClient();
  
  try {
    // 上传文件
    const result = await client.put(fileName, fileBuffer, {
      mime: mimeType || 'application/octet-stream', // 设置 MIME 类型
    });
    
    // 返回文件的 URL
    return result.url;
  } catch (error) {
    console.error('OSS Upload Error:', error);
    throw new Error(`文件上传失败: ${error}`);
  }
};

// 处理上传的文件数据
const processUploadedFile = (fileData: string): { buffer: Buffer; mimeType?: string } => {
  const matches = fileData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  
  if (!matches || matches.length !== 3) {
    throw new Error("无效的文件格式");
  }

  const mimeType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');
  
  return { buffer, mimeType };
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    img,
    student_ex_timetable_id,
    student_name,
    grade,
    year,
    quarter,
    school,
    subject,
    parentid,
    originalFileName
  } = data;

  let parent_student_ex_timetable_Data;

  try {
    let fileUrl = '';

    // 如果有文件上传
    if (img) {
      try {
        // 处理 Base64 字符串
        const { buffer, mimeType } = processUploadedFile(img);
        
        // 生成唯一的文件名
        const timestamp = Date.now();
        const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;
        const fileExtension = originalFileName?.split('.').pop() || 'bin'; // 获取文件扩展名
        const ossFileName = `uploads/${safeFileName}.${fileExtension}`; // 在 OSS 中存储的路径

        // 上传到 OSS
        fileUrl = await uploadFileToOSS(buffer, ossFileName, mimeType);
      } catch (uploadError) {
        console.error('File processing failed:', uploadError);
        return {
          error: `文件处理失败: ${uploadError instanceof Error ? uploadError.message : '未知错误'}`,
        };
      }
    }

    // 创建数据库记录
    parent_student_ex_timetable_Data = await db.student_ex_timetable.create({
      data: {
        name: name,
        img: fileUrl, // 存储 OSS 文件的 URL
        student_ex_timetable_id: student_ex_timetable_id,
        student_name: student_name,
        grade: grade,
        year: year,
        quarter: quarter,
        school: school,
        subject: subject
      }
    });

    // 重新验证页面
    revalidatePath(`/parent/${parentid}/profiles/${student_ex_timetable_id}/upload/extimeLists`);

    // 返回成功结果和数据
    return {
      data: parent_student_ex_timetable_Data,
      success: true,
    };

  } catch (error) {
    console.error('Database operation failed:', error);
    return {
      error: `操作失败: ${error instanceof Error ? error.message : '未知错误'}`,
    };
  }
};

export const createParentStudentExTimeTable = CreateSafeAction(parent_student_ex_timetable_create_schema, handler);
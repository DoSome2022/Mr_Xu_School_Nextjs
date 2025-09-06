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

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { parent_student_ex_pager_create_schema } from "./schema";
import { redirect } from "next/navigation";
import { writeFile } from "fs/promises";
import { join } from "path";
import { student_ex_paper } from "@prisma/client";

// 處理不同類型文件的函數
const processUploadedFile = (fileData: string, originalFileName: string) => {
  // 移除 base64 前綴 (data:image/jpeg;base64, 或其他 MIME 類型)
  const base64Content = fileData.split(";base64,").pop();
  if (!base64Content) {
    throw new Error("無效的檔案格式");
  }

  // 從原始文件名中提取擴展名
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

    let relativePath = "/uploads/default.png"; // 默認圖片路徑

    if (img && originalFileName) {
      // 生成唯一的文件名
      const timestamp = Date.now();
      const safeFileName = `${timestamp}-${name}-${student_name}-${grade}-${year}-${school}`;

      // 處理上傳的文件
      const { buffer, fileExtension } = processUploadedFile(img, originalFileName);

      // 確定文件存儲路徑
      const fileNameWithExt = `${safeFileName}.${fileExtension}`;
      const filePath = join(process.cwd(), "public", "uploads", fileNameWithExt);

      // 寫入文件
      await writeFile(filePath, buffer);

      // 存儲相對路徑到數據庫
      relativePath = `/uploads/${fileNameWithExt}`;
    }

    parent_student_ex_pager_Data = await db.student_ex_paper.create({
      data: {
        name,
        img: relativePath, // 始終提供 img
        student_ex_paper_id,
        student_name,
        grade,
        quarter,
        school,
        year,
        subject,
      },
    });

    // 重新驗證頁面
    revalidatePath(`/parent/${parentid}/profiles/${student_ex_paper_id}/upload/expageLists`);

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- parent_student_ex_pager_Data -- : ", parent_student_ex_pager_Data, " -- End -- ");
    }

    // 重定向
    redirect(`/parent/${parentid}/profiles/${student_ex_paper_id}/upload/expageLists`);

    return { data: parent_student_ex_pager_Data };
  } catch (error) {
    console.error("創建學生試卷記錄失敗:", error);
    return { error: "無法創建學生試卷記錄，請檢查輸入數據" };
  }
};

export const createparentstudentexpager = CreateSafeAction(parent_student_ex_pager_create_schema, handler);
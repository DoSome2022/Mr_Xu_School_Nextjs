// "use server";

// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Supstudent_ex_timetable_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";


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
//             parentId
//         } = data;

//     let student_ex_timetable_Data;

//     try {
//         student_ex_timetable_Data = await db.student_ex_timetable.create({
//             data:{
//                 name : name,
//                 img : img,
//                 student_ex_timetable_id : student_ex_timetable_id,
//                 student_name : student_name,
//                 grade : grade,
//                 year : year,
//                 quarter : quarter,
//                 school: school,
//                 subject: subject
//             }
//         });
//         revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_ex_timetable_id}/extimeLists`)
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- student_ex_timetable_Data -- : " , student_ex_timetable_Data , " -- End -- ")
//     return redirect(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_ex_timetable_id}/extimeLists`)
// }

// export const SupcreateStudentExTimeTable = CreateSafeAction(Supstudent_ex_timetable_Create_Schema, handler)

"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_ex_timetable_Create_Schema } from "./schema";
import { revalidatePath } from "next/cache";
import OSS from "ali-oss";

    // 初始化 OSS 客戶端
    const client = new OSS({
      region: process.env.ALIBABA_CLOUD_OSS_REGION!,
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
      bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET!,
      endpoint: process.env.ALIBABA_CLOUD_OSS_ENDPOINT,
    });

// 根據 MIME 類型決定副檔名
const getFileExtensionFromMimeType = (base64Data: string): string => {
  if (base64Data.startsWith("data:application/pdf")) {
    return ".pdf";
  } else if (base64Data.match(/^data:image\/(jpeg|jpg|png)/)) {
    return `.${base64Data.match(/^data:image\/(jpeg|jpg|png)/)?.[1] || "jpg"}`;
  }
  return ".jpg"; // 默認值
};

// 處理文件上傳到 OSS
const processUploadedFile = async (base64Data: string, fileName: string): Promise<string> => {
  try {
    const extension = getFileExtensionFromMimeType(base64Data);
    const safeFileName = `${fileName}-${Date.now()}${extension}`; // 添加時間戳避免衝突
    const buffer = Buffer.from(base64Data.split(",")[1], "base64"); // 移除 Base64 前綴

    const result = await client.put(`uploads/${safeFileName}`, buffer);
    return result.url; // 返回 OSS 文件 URL
  } catch (error) {
    console.error("OSS 上傳失敗:", error);
    throw new Error("無法上傳文件到 OSS");
  }
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
    parentId,
    supadminId,
  } = data;

  try {
    // 轉換 subject（例如 "chinese" -> "中"）
    const normalizedSubject = subject === "chinese" ? "中" : subject;

    // 處理文件上傳到 OSS
    let imgUrl = "";
    if (img) {
      imgUrl = await processUploadedFile(img, name);
    }

    // 創建資料庫記錄
    const student_ex_timetable_Data = await db.student_ex_timetable.create({
      data: {
        name,
        img: imgUrl,
        student_ex_timetable_id,
        student_name,
        grade,
        year,
        quarter,
        school,
        subject: normalizedSubject,
      },
    });

    // 重新驗證快取
    revalidatePath(`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/studentLists/${student_ex_timetable_id}/extimeLists`);

    return {
      success: "考試卷資料創建成功",
      data: student_ex_timetable_Data,
    };
  } catch (error) {
    console.error("創建考試卷失敗:", error);
    return {
      error: error instanceof Error ? error.message : "無法創建考試卷資料",
    };
  }
};

export const SupcreateStudentExTimeTable = CreateSafeAction(Supstudent_ex_timetable_Create_Schema, handler);
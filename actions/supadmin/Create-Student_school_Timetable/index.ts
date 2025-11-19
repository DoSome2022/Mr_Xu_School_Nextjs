// "use server";

// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Supstudent_school_timetable_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {
//             name,
//             img,
//             student_school_timetable_id,
//             student_name,
//             grade,
//             year,
//             quarter,
//             school,
//             parentId,
//         } = data;

//     let student_school_timetable_Data;

//     try {
//         student_school_timetable_Data = await db.student_school_timetable.create({
//             data:{
//                 name : name,
//                 img : img,
//                 student_school_timetable_id : student_school_timetable_id,
//                 student_name : student_name,
//                 grade : grade,
//                 year : year,
//                 quarter : quarter,
//                 school : school,
//             }
//         });
//         revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_school_timetable_id}/schooltimetableLists/`)
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- student_school_timetable_Data -- : " , student_school_timetable_Data , " -- End -- ")
//     return redirect(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_school_timetable_id}/schooltimetableLists/`)
// }

// export const SupcreateStudentSchoolTimetable = CreateSafeAction(Supstudent_school_timetable_Create_Schema, handler)

"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_school_timetable_Create_Schema } from "./schema";
import { revalidatePath } from "next/cache";
import OSS from "ali-oss";


const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    name,
    img,
    student_school_timetable_id,
    student_name,
    grade,
    year,
    quarter,
    school,
    parentId,
    supadminId,
  } = data;

  try {
    // 處理 Base64 文件
    if (!img || !img.startsWith("data:")) {
      throw new Error("無效的文件數據");
    }

    // 提取 MIME 類型和數據
    const [mimePart, base64Data] = img.split(",");
    const mimeType = mimePart.match(/data:([^;]+);base64/)?.[1];
    if (!mimeType) {
      throw new Error("無法解析文件類型");
    }

    // 根據 MIME 類型決定副檔名
    let fileExtension = "bin";
    if (mimeType === "application/pdf") {
      fileExtension = "pdf";
    } else if (mimeType.startsWith("image/")) {
      fileExtension = mimeType.split("/")[1] || "jpg";
    } else {
      throw new Error("不支援的文件格式");
    }

    // 初始化 OSS 客戶端
    const client = new OSS({
      region: process.env.ALIBABA_CLOUD_OSS_REGION!,
      accessKeyId: process.env.ALIBABA_CLOUD_ACCESS_KEY_ID!,
      accessKeySecret: process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET!,
      bucket: process.env.ALIBABA_CLOUD_OSS_BUCKET!,
      endpoint: process.env.ALIBABA_CLOUD_OSS_ENDPOINT,
    });

    // 生成唯一文件名
    const safeFileName = name.replace(/\s+/g, "_");
    const uniqueFileName = `${safeFileName}.${fileExtension}`;
    const ossPath = `Uploads/timetables/${uniqueFileName}`;

    // 將 Base64 轉為 Buffer
    const buffer = Buffer.from(base64Data, "base64");

    // 上傳到 OSS
    const result = await client.put(ossPath, buffer);
    const fileUrl = result.url.replace("http://", "https://");

    // 創建資料庫記錄
    const student_school_timetable_Data = await db.student_school_timetable.create({
      data: {
        name,
        img: fileUrl, // 儲存 OSS URL
        student_school_timetable_id,
        student_name,
        grade,
        year,
        quarter,
        school,
      },
    });

    // 刷新快取
    revalidatePath(`/supadmin/${supadminId}/userLists/parentsLists/${parentId}/studentLists/${student_school_timetable_id}/schooltimetableLists/`);

    console.log("-- student_school_timetable_Data -- : ", student_school_timetable_Data, " -- End -- ");
    return { success: "時間表建立成功", data: student_school_timetable_Data };
  } catch (error) {
    console.error("建立時間表失敗:", error);
    const errorMessage = error instanceof Error ? error.message : "無法建立時間表";
    return { error: errorMessage };
  }
};

export const SupcreateStudentSchoolTimetable = CreateSafeAction(Supstudent_school_timetable_Create_Schema, handler);
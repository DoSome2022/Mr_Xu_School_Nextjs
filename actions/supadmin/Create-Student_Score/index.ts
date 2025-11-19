// "use server";

// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Supstudent_score_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";
// import { revalidatePath } from "next/cache";


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
//         parentId,
//         } = data;

//     let student_score_Data;

//     try {
//         student_score_Data = await db.student_score.create({
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
//                 img:img,
//             }
//         });
//         revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_score_id}/scoreLists/`)
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- student_score_Data -- : " , student_score_Data , " -- End -- ")
//     return redirect (`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_score_id}/scoreLists/`)
// }

// export const SupcreateStudentScore = CreateSafeAction(Supstudent_score_Create_Schema, handler)

"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_score_Create_Schema } from "./schema";
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

const getFileExtensionFromMimeType = (base64Data: string): string => {
  if (base64Data.startsWith("data:application/pdf")) {
    return ".pdf";
  } else if (base64Data.match(/^data:image\/(jpeg|jpg|png)/)) {
    return `.${base64Data.match(/^data:image\/(jpeg|jpg|png)/)?.[1] || "jpg"}`;
  }
  return ".jpg"; // 默認值
};

const processUploadedFile = async (base64Data: string, fileName: string): Promise<string> => {
  try {
    const extension = getFileExtensionFromMimeType(base64Data);
    const safeFileName = `${fileName}-${Date.now()}${extension}`;
    const buffer = Buffer.from(base64Data.split(",")[1], "base64");
    const result = await client.put(`uploads/${safeFileName}`, buffer);
    return result.url;
  } catch (error) {
    console.error("OSS 上傳失敗:", error);
    throw new Error("無法上傳文件到 OSS");
  }
};

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    student_name,
    student_score_id,
    subject,
    grade,
    score,
    quarter,
    school,
    year,
    name,
    img,
    parentId,
  } = data;

  try {
    let imgUrl = "";
    if (img) {
      imgUrl = await processUploadedFile(img, name);
    }

    const student_score_Data = await db.student_score.create({
      data: {
        student_name,
        student_score_id,
        subject,
        grade,
        score,
        quarter,
        year,
        school,
        name,
        img: imgUrl,
      },
    });

    revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_score_id}/scoreLists/`);

    return {
      success: "資料更新成功",
      data: student_score_Data,
    };
  } catch (error) {
    console.error("創建失敗:", error);
    return {
      error: error instanceof Error ? error.message : "無法創建資料",
    };
  }
};

export const SupcreateStudentScore = CreateSafeAction(Supstudent_score_Create_Schema, handler);
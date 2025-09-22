// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Score_Create_Schema } from "./schema";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {
//         school_name,
//         school_score_id,
//         subject,
//         grade,
//         score,
//         quarter
//         } = data;

//     let score_Data;

//     try {
//         score_Data = await db.score.create({
//             data:{
//                 school_name : school_name,
//                 school_score_id : school_score_id,
//                 subject : subject,
//                 grade : grade,
//                 score : score,
//                 quarter : quarter
//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- score_Data -- : " , score_Data , " -- End -- ")
//     return { data: score_Data }
// }

// export const createScore = CreateSafeAction(Score_Create_Schema, handler)


// actions/Create-Score/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; // 添加 redirect 導入
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Score_Create_Schema } from "./schema";
import { Score } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { student_name,school_name ,school_score_id, subject, grade, score, quarter , school_id } = data;

  let score_Data: Score;

  try {
    // 驗證 school_score_id 是否存在
    const student = await db.student.findUnique({
      where: { id: school_score_id },
    });
    if (!student) {
      return { error: "學生不存在" };
    }

    // 驗證 student_name 是否與學生記錄匹配（可選）
    if (student.name !== student_name) {
      return { error: "學生名字與學生 ID 不匹配" };
    }

    score_Data = await db.score.create({
      data: {
        student_name,
        school_name,
        subject,
        grade,
        score,
        quarter,
        student: { connect: { id: school_score_id } },
        school_score: { connect: { id: data.school_id } }, // 假設 schema 包含 school_id
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("-- Score_Data_create -- : ", score_Data, " -- End -- ");
    }

    revalidatePath(`/admin/students/${school_score_id}/scores`);
    redirect(`/admin/students/${school_score_id}/scores`);
  } catch (error: any) {
    console.error("創建成績失敗:", error.message, error.stack);
    return {
      error: "創建成績失敗，請檢查輸入數據",
    };
  }
};

export const createScore = CreateSafeAction(Score_Create_Schema, handler);
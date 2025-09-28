// // actions/supadmin/Update-School/index.ts

// "use server";

// import { revalidatePath } from "next/cache";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { SupSchool_Update_Schema } from "./schema";
// import { School } from "@prisma/client";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { school_id, school_name, grade, quarter, chine_data, math_data, eng_data, supadminId } = data;

//   console.log("-- School_Data_Input -- : ", data, " -- End -- ");

//   let school_data: School | undefined;

//   try {
//     // 驗證學校是否存在
//     const existingSchool = await db.school.findUnique({
//       where: { id: school_id },
//     });
//     if (!existingSchool) {
//       return { error: "學校不存在" };
//     }

//     // 驗證 supadminId（如果提供）
//     if (supadminId) {
//       const existingSupadmin = await db.user.findUnique({
//         where: { id: supadminId },
//       });
//       if (!existingSupadmin) {
//         return { error: "管理員ID無效" };
//       }
//     }

//     // 更新 School 模型（僅 school_name）
//     school_data = await db.school.update({
//       where: { id: school_id },
//       data: {
//         school_name,
//       },
//     });

//     // 更新或創建 School_Subject 記錄
//     if (chine_data || math_data || eng_data) {
//       await db.school_Subject.upsert({
//         where: {
//           school_subject_id_grade_quarter: {
//             school_subject_id: school_id,
//             grade,
//             quarter,
//           },
//         },
//         update: {
//           chine_data: chine_data || undefined,
//           math_data: math_data || undefined,
//           eng_data: eng_data || undefined,
//         },
//         create: {
//           school_subject_id: school_id,
//           grade,
//           quarter,
//           chine_data: chine_data || "",
//           math_data: math_data || "",
//           eng_data: eng_data || "",
//         },
//       });
//     }

//     // 記錄成功更新（僅用於開發環境）
//     if (process.env.NODE_ENV === "development") {
//       console.log("-- Update_School_Data -- : ", school_data, " -- End -- ");
//       console.log("-- Update_School_Subject_Data -- : ", { grade, quarter, chine_data, math_data, eng_data }, " -- End -- ");
//     }

//     // 重新驗證相關頁面
//     revalidatePath(`/supadmin/${supadminId}/userLists/schoolLists/${school_id}`);

//     return { data: school_data, success: "學校資料更新成功" };
//   } catch (error: any) {
//     console.error("更新學校資料失敗:", error);
//     if (error.code === "P2025") {
//       return { error: "學校記錄不存在，無法更新" };
//     }
//     return { error: error.message || "更新學校資料失敗，請檢查輸入數據" };
//   }
// };

// export const Supupdate_School_action = CreateSafeAction(SupSchool_Update_Schema, handler);




// actions/supadmin/Update-School/index.ts

"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupSchool_Update_Schema } from "./schema";
import { School } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { school_id, school_name, grade, quarter, chine_data, math_data, eng_data, supadminId } = data;

  console.log("-- School_Data_Input -- : ", data, " -- End -- ");

  let school_data: School | undefined;

  try {
    // 驗證學校是否存在
    const existingSchool = await db.school.findUnique({
      where: { id: school_id },
    });
    if (!existingSchool) {
      return { error: "學校不存在" };
    }

    // 驗證 supadminId（如果提供）
    if (supadminId) {
      const existingSupadmin = await db.user.findUnique({
        where: { id: supadminId },
      });
      if (!existingSupadmin) {
        return { error: "管理員ID無效" };
      }
    }

    // 更新 School 模型（僅 school_name）
    school_data = await db.school.update({
      where: { id: school_id },
      data: {
        school_name,
      },
    });

    // 更新或創建 School_Subject 記錄
    if (chine_data || math_data || eng_data) {
      await db.school_Subject.upsert({
        where: {
          school_subject_id_grade_quarter: {
            school_subject_id: school_id,
            grade,
            quarter,
          },
        },
        update: {
          chine_data: chine_data || undefined,
          math_data: math_data || undefined,
          eng_data: eng_data || undefined,
        },
        create: {
          school_subject_id: school_id,
          grade,
          quarter,
          chine_data: chine_data || "",
          math_data: math_data || "",
          eng_data: eng_data || "",
        },
      });
    }

    // 記錄成功更新（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Update_School_Data -- : ", school_data, " -- End -- ");
      console.log("-- Update_School_Subject_Data -- : ", { grade, quarter, chine_data, math_data, eng_data }, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/supadmin/${supadminId}/userLists/schoolLists/${school_id}`);

    return { data: school_data, success: "學校資料更新成功" };
  } catch (error: any) {
    console.error("更新學校資料失敗:", error);
    if (error.code === "P2025") {
      return { error: "學校記錄不存在，無法更新" };
    }
    return { error: error.message || "更新學校資料失敗，請檢查輸入數據" };
  }
};

export const Supupdate_School_action = CreateSafeAction(SupSchool_Update_Schema, handler);
// "use server";

// import { revalidatePath } from "next/cache";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { AttenDance_Create_Schema } from "./schema";
// import { z } from "zod";

// // 定義批量處理的輸入類型
// type BatchInputType = InputType[];

// // 修改 handler 以支持批量處理並更新 Class
// const handler = async (data: BatchInputType): Promise<ReturnType> => {
//     try {
//         // 創建所有學生的 AttenDance 記錄
//         const attendanceRecords = await db.attenDance.createMany({
//             data: data.map(item => ({
//                 classroomId: item.classroomId,
//                 studentId: item.studentId,
//                 isPresent: item.isPresent,
//                 isLate: item.isLate,
//             })),
//         });

//         // 獲取 classroomId（假設所有記錄的 classroomId 相同）
//         const classroomId = data[0].classroomId;

//         // 過濾出 isPresent 為 true 的學生
//         const presentStudents = data.filter(item => item.isPresent);

//         // 從 Student 表中查詢這些學生的名字
//         const studentIds = presentStudents.map(item => item.studentId);
//         const students = await db.student.findMany({
//             where: {
//                 id: { in: studentIds },
//             },
//             select: {
//                 name: true,
//             },
//         });

//         const attendNames = students.map(student => student.name);

//         // 更新 Class 表
//         await db.class.update({
//             where: {
//                 id: classroomId,
//             },
//             data: {
//                 attend_name: attendNames,
//                 attend_number: attendNames.length,
//                 isSubmittedform: true,
//             },
//         });

//         console.log("-- AttenDance_data created and Class updated --");
//         return { data: attendanceRecords };
//     } catch (error) {
//         console.error("Error creating attendance or updating class:", error);
//         return { error: "Failed to process attendance" };
//     }
// };

// // 更新 schema 以支持陣列輸入
// export const createAttenDance = CreateSafeAction(z.array(AttenDance_Create_Schema), handler);

"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { AttenDance_Create_Schema } from "./schema";
import { z } from "zod";

// 定義批量處理的輸入類型
type BatchInputType = InputType[];

// 修改 handler 以支持批量處理並更新 Class
const handler = async (data: BatchInputType): Promise<ReturnType> => {
  try {
    // 檢查輸入數據是否為空
    if (data.length === 0) {
      return { error: "考勤數據不能為空" };
    }

    // 檢查所有記錄的 classroomId 是否一致
    const classroomId = data[0].classroomId;
    const isValidClassroom = data.every((item) => item.classroomId === classroomId);
    if (!isValidClassroom) {
      return { error: "所有考勤記錄必須屬於同一課程" };
    }

    // 創建所有學生的 AttenDance 記錄並返回創建的記錄
    const attendanceRecords = await Promise.all(
      data.map((item) =>
        db.attenDance.create({
          data: {
            classroomId: item.classroomId,
            studentId: item.studentId,
            isPresent: item.isPresent,
            isLate: item.isLate,
          },
        })
      )
    );

    // 過濾出 isPresent 為 true 的學生
    const presentStudents = data.filter((item) => item.isPresent);
    const studentIds = presentStudents.map((item) => item.studentId);

    // 從 Student 表中查詢這些學生的名字
    const students = await db.student.findMany({
      where: {
        id: { in: studentIds },
      },
      select: {
        name: true,
      },
    });

    const attendNames = students.map((student) => student.name);

    // 更新 Class 表
    await db.class.update({
      where: {
        id: classroomId,
      },
      data: {
        attend_name: attendNames,
        attend_number: attendNames.length,
        isSubmittedform: true,
      },
    });

    // 重新驗證相關頁面
    revalidatePath(`/admin/class/${classroomId}`);

    console.log("-- AttenDance_data created and Class updated --");
    return { data: attendanceRecords };
  } catch (error) {
    console.error("Error creating attendance or updating class:", error);
    return { error: "無法處理考勤記錄" };
  }
};

// 更新 schema 以支持陣列輸入
export const createAttenDance = CreateSafeAction(z.array(AttenDance_Create_Schema), handler);
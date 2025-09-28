// // actions/supadmin/Create-ChangeClass/index.ts
// "use server";

// import { revalidatePath } from "next/cache";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { SupChangeClass_Create_Schema } from "./schema";
// import { ChangeClass } from "@prisma/client";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const {
//     studentId,
//     targetclassId,
//     currentclassId,
//     class_date,
//     name,
//     student_class_date,
//     courseId,
//   } = data;

//   try {
//     // 使用 Prisma 交易確保所有操作原子化
//     const changeClass = await db.$transaction(async (prisma) => {
//       // 1. 驗證 studentId 是否存在
//       const student = await prisma.student.findUnique({
//         where: { id: studentId },
//       });
//       if (!student) {
//         throw new Error(`找不到學生 ID: ${studentId}`);
//       }

//       // 2. 驗證 targetclassId 是否存在
//       const targetClass = await prisma.class.findUnique({
//         where: { id: targetclassId },
//       });
//       if (!targetClass) {
//         throw new Error(`找不到原本的班級 ID: ${targetclassId}`);
//       }

//       // 3. 驗證 currentclassId 是否存在
//       const currentClass = await prisma.class.findUnique({
//         where: { id: currentclassId },
//       });
//       if (!currentClass) {
//         throw new Error(`找不到目標班級 ID: ${currentclassId}`);
//       }

//       // 4. 驗證 class_course_id 是否匹配
//       if (targetClass.class_course_id !== courseId || currentClass.class_course_id !== courseId) {
//         throw new Error("目標班級或當前班級不屬於指定課程");
//       }

//       // 5. 創建 ChangeClass 記錄
//       const changeClass = await prisma.changeClass.create({
//         data: {
//           targetclassId,
//           currentclassId,
//           date: class_date,
//           name,
//           class_date: student_class_date,
//         },
//       });

//       // 6. 更新原本的班級（targetclassId）
//       await prisma.class.update({
//         where: { id: targetclassId },
//         data: {
//           persons: { decrement: 1 },
//           node: { decrement: 1 },
//         },
//       });

//       // 7. 從學生的 student_class 中移除原本的班級
//       await prisma.student.update({
//         where: { id: studentId },
//         data: {
//           student_class: {
//             disconnect: { id: targetclassId },
//           },
//         },
//       });

//       // 8. 更新目標班級（currentclassId）
//       await prisma.class.update({
//         where: { id: currentclassId },
//         data: {
//           persons: { increment: 1 },
//           node: { increment: 1 },
//         },
//       });

//       // 9. 為學生的 student_class 添加目標班級
//       await prisma.student.update({
//         where: { id: studentId },
//         data: {
//           student_class: {
//             connect: { id: currentclassId },
//           },
//         },
//       });

//       return changeClass;
//     });

//     console.log("-- ChangeClass Created -- : ", changeClass, " -- End -- ");

//     // 重新驗證路徑以更新頁面數據
//     revalidatePath(`/admin/courseLists/${courseId}/classLists/${targetclassId}`);
//     revalidatePath(`/admin/courseLists/${courseId}/classLists/${currentclassId}`);

//     // 返回成功結果
//     return {
//       data: changeClass,
//       success: "調堂記錄創建成功",
//     };
//   } catch (error: any) {
//     console.error("-- ChangeClass Error -- : ", error.message, error.stack);
//     return {
//       error: error.message || "創建調堂記錄失敗，請檢查輸入數據",
//     };
//   }
// };

// export const SupcreateChangeClass = CreateSafeAction(SupChangeClass_Create_Schema, handler);


// actions/supadmin/Create-ChangeClass/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupChangeClass_Create_Schema } from "./schema";
import { ChangeClass } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    studentId,
    targetclassId,
    currentclassId,
    class_date,
    name,
    student_class_date,
    courseId,
  } = data;

  try {
    // 使用 Prisma 交易確保所有操作原子化
    const changeClass = await db.$transaction(async (prisma) => {
      // 1. 驗證 studentId 是否存在
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });
      if (!student) {
        throw new Error(`找不到學生 ID: ${studentId}`);
      }

      // 2. 驗證 targetclassId 是否存在
      const targetClass = await prisma.class.findUnique({
        where: { id: targetclassId },
      });
      if (!targetClass) {
        throw new Error(`找不到原本的班級 ID: ${targetclassId}`);
      }

      // 3. 驗證 currentclassId 是否存在
      const currentClass = await prisma.class.findUnique({
        where: { id: currentclassId },
      });
      if (!currentClass) {
        throw new Error(`找不到目標班級 ID: ${currentclassId}`);
      }

      // 4. 驗證 class_course_id 是否匹配
      if (targetClass.class_course_id !== courseId || currentClass.class_course_id !== courseId) {
        throw new Error("目標班級或當前班級不屬於指定課程");
      }

      // 5. 驗證學生是否已在目標班級
      const existingRelation = await prisma.student.findFirst({
        where: {
          id: studentId,
          student_class: { some: { id: currentclassId } },
        },
      });
      if (existingRelation) {
        throw new Error("學生已在目標班級");
      }

      // 6. 創建 ChangeClass 記錄
      const changeClass = await prisma.changeClass.create({
        data: {
          targetclassId,
          currentclassId,
          date: class_date,
          name,
          class_date: student_class_date,
        },
      });

      // 7. 更新原本的班級（targetclassId）
      await prisma.class.update({
        where: { id: targetclassId },
        data: {
          persons: { decrement: 1 },
          node: { decrement: 1 },
        },
      });

      // 8. 從學生的 student_class 中移除原本的班級
      await prisma.student.update({
        where: { id: studentId },
        data: {
          student_class: {
            disconnect: { id: targetclassId },
          },
        },
      });

      // 9. 更新目標班級（currentclassId）
      await prisma.class.update({
        where: { id: currentclassId },
        data: {
          persons: { increment: 1 },
          node: { increment: 1 },
        },
      });

      // 10. 為學生的 student_class 添加目標班級
      await prisma.student.update({
        where: { id: studentId },
        data: {
          student_class: {
            connect: { id: currentclassId },
          },
        },
      });

      return changeClass;
    });

    console.log("-- ChangeClass Created -- : ", changeClass, " -- End -- ");

    // 重新驗證路徑以更新頁面數據
    revalidatePath(`/supadmin/${courseId}/classLists/${targetclassId}`);
    revalidatePath(`/supadmin/${courseId}/classLists/${currentclassId}`);

    // 返回成功結果
    return {
      data: changeClass,
      success: "調堂記錄創建成功",
    };
  } catch (error: any) {
    console.error("-- ChangeClass Error -- : ", error.message, error.stack);
    return {
      error: error.message || "創建調堂記錄失敗，請檢查輸入數據",
    };
  }
};

export const SupcreateChangeClass = CreateSafeAction(SupChangeClass_Create_Schema, handler);
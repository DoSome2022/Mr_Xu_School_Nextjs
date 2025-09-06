// "use server"; // 標記為伺服器指令，確保在伺服器端執行

// import { db } from "@/lib/db";
// import { revalidatePath } from "next/cache";

// // 更新單個 Class 的 isshow 狀態
// export async function toggleClassVisibility(classId: string, isshow: boolean) {
//   try {
//     await db.class.update({
//       where: { id: classId },
//       data: { isshow },
//     });
//     revalidatePath("/admin/classroom");
//     return { success: `課堂 ${isshow ? "顯示" : "隱藏"} 成功` };
//   } catch (error) {
//     console.error("更新課堂顯示狀態錯誤:", error);
//     return { error: "更新課堂顯示狀態失敗" };
//   }
// }

// // 更新單個 Course 的 isshow 狀態，並可選擇更新其所有 Class
// export async function toggleCourseVisibility(
//   courseId: string,
//   isshow: boolean,
//   updateClasses: boolean = false
// ) {
//   try {
//     await db.$transaction(async (prisma) => {
//       await prisma.course.update({
//         where: { id: courseId },
//         data: { isshow },
//       });
//       if (updateClasses) {
//         await prisma.class.updateMany({
//           where: { class_course_id: courseId },
//           data: { isshow },
//         });
//       }
//     });
//     revalidatePath("/admin/classroom");
//     return { success: `課程 ${isshow ? "顯示" : "隱藏"} 成功` };
//   } catch (error) {
//     console.error("更新課程顯示狀態錯誤:", error);
//     return { error: "更新課程顯示狀態失敗" };
//   }
// }


"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

interface ToggleResponse {
  success?: string;
  error?: string;
}

// 更新單個 Class 的 isshow 狀態
export async function toggleClassVisibility(classId: string, isshow: boolean): Promise<ToggleResponse> {
  try {
    // 檢查 Class 是否存在
    const classRecord = await db.class.findUnique({ where: { id: classId } });
    if (!classRecord) {
      return { error: `課堂 (ID: ${classId}) 不存在` };
    }

    await db.class.update({
      where: { id: classId },
      data: { isshow },
    });
    revalidatePath("/admin/classroom");
    return { success: `課堂 ${isshow ? "顯示" : "隱藏"} 成功` };
  } catch (error) {
    console.error(`更新課堂顯示狀態錯誤 (ID: ${classId}):`, error);
    return { error: "更新課堂顯示狀態失敗，請稍後重試" };
  }
}

// 更新單個 Course 的 isshow 狀態，並可選擇更新其所有 Class
export async function toggleCourseVisibility(
  courseId: string,
  isshow: boolean,
  updateClasses: boolean = false
): Promise<ToggleResponse> {
  try {
    // 檢查 Course 是否存在
    const courseRecord = await db.course.findUnique({ where: { id: courseId } });
    if (!courseRecord) {
      return { error: `課程 (ID: ${courseId}) 不存在` };
    }

    await db.$transaction(async (prisma) => {
      // 更新 Course
      await prisma.course.update({
        where: { id: courseId },
        data: { isshow },
      });

      // 如果需要，更新相關 Class
      if (updateClasses) {
        const updatedClasses = await prisma.class.updateMany({
          where: { class_course_id: courseId },
          data: { isshow },
        });
        console.log(`更新了 ${updatedClasses.count} 個相關課堂的顯示狀態`);
      }
    });

    revalidatePath("/admin/classroom");
    return { success: `課程 ${isshow ? "顯示" : "隱藏"} 成功` };
  } catch (error) {
    console.error(`更新課程顯示狀態錯誤 (ID: ${courseId}):`, error);
    return { error: "更新課程顯示狀態失敗，請稍後重試" };
  }
}
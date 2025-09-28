"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Class_Update_Schema } from "./schema";
import { Class } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    freq,
    // byweekday,
    class_course_id,
    allDay,
    attend_number,
    class_time_h,
    cram,
    classroomId,
    persons,
    class_lesson,
    class_date,
    class_start_time,
    class_end_time,
    teacher,
    node,
    grade,
    title,
    classId,
  } = data;

  let class_data: Class | undefined;

  try {
    // 驗證 classId 是否存在
    const classRecord = await db.class.findUnique({
      where: { id: classId },
    });
    if (!classRecord) {
      return { error: "班級不存在" };
    }

    // 驗證 class_course_id 是否存在
    const course = await db.course.findUnique({
      where: { id: class_course_id },
    });
    if (!course) {
      return { error: "課程不存在" };
    }

    // 驗證 classroomId 是否存在
    const classroom = await db.classroom.findUnique({
      where: { id: classroomId },
    });
    if (!classroom) {
      return { error: "教室不存在" };
    }

    // 驗證 teacher 是否存在（假設有 StaffUser 模型）
    const teacherRecord = await db.staffUser.findFirst({
      where: { username: teacher },
    });
    if (!teacherRecord) {
      return { error: "教師不存在" };
    }

    // 驗證並格式化 class_date（選取第一個日期）
    if (!class_date || class_date.length === 0) {
      return { error: "課程日期不可為空" };
    }
    const formattedClassDate = class_date[0].toISOString().split("T")[0];
    const parsedDate = new Date(formattedClassDate);
    if (isNaN(parsedDate.getTime())) {
      return { error: "無效的課程日期格式" };
    }

    class_data = await db.class.update({
      where: {
        id: classId,
      },
      data: {
        freq,
        // byweekday,
        title,
        allDay,
        class_start_time,
        class_end_time,
        class_time_h,
        class_lesson,
        class_course_id,
        attend_number,
        persons,
        node,
        grade,
        cram,
        class_date: formattedClassDate,
        classroom: {
          connect: { id: classroomId },
        },
        teacher,
      },
    });

    // 記錄成功更新（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Class_Data_update -- : ", class_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/admin/courseLists/${class_course_id}/classLists/${classId}`);

    return { data: class_data, success: "班級更新成功" };
  } catch (error: any) {
    console.error("更新班級失敗:", error);
    return {
      error: error.message || "更新班級失敗，請檢查輸入數據",
    };
  }
};

export const updateClass = CreateSafeAction(Class_Update_Schema, handler);
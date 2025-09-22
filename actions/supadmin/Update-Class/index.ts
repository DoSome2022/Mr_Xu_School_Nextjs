// actions/supadmin/Update-Class/index.ts
"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupClass_Update_Schema } from "./schema";
import { redirect } from "next/navigation";
import { Class } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    freq,
    byweekday,
    class_course_id,
    allDay,
    attend_number,
    class_time_h,
    cram,
    classroom,
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
    const existingClass = await db.class.findUnique({
      where: { id: classId },
    });
    if (!existingClass) {
      return { error: "班級不存在" };
    }

    // 驗證 class_course_id 是否存在
    const course = await db.course.findUnique({
      where: { id: class_course_id },
    });
    if (!course) {
      return { error: "課程不存在" };
    }

    // 驗證 classroom 是否存在
    const classrooms = await db.classroom.findMany({
      where: { id: { in: classroom } }, // classroom 為 string[]
    });
    if (classrooms.length !== classroom.length) {
      return { error: "部分教室不存在" };
    }

    // 驗證 teacher 是否存在
    const teacherRecord = await db.staffUser.findFirst({
      where: { username: teacher },
    });
    if (!teacherRecord) {
      return { error: "教師不存在" };
    }

    class_data = await db.class.update({
      where: {
        id: classId,
      },
      data: {
        class_time_h,
        cram,
        classroom: {
          set: [], // 清空現有關聯
          connect: classroom.map((id) => ({ id })), // 連接到多個教室
        },
        persons,
        class_course_id,
        class_lesson,
        class_date: class_date[0], // 取第一個日期
        class_start_time,
        class_end_time,
        attend_number,
        teacher,
        node,
        grade,
        freq,
        title,
        allDay,
      },
    });

    if (process.env.NODE_ENV === "development") {
      console.log("-- Class_Data_update -- : ", class_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/admin/courseLists/${class_course_id}/classLists/${classId}`);

    // 重定向
    redirect(`/admin/courseLists/${class_course_id}/classLists/${classId}`);
  } catch (error: any) {
    console.error("更新班級失敗:", error.message, error.stack);
    return {
      error: "更新班級失敗，請檢查輸入數據",
    };
  }
};

export const SupupdateClass = CreateSafeAction(SupClass_Update_Schema, handler);
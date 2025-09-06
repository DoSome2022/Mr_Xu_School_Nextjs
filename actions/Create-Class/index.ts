"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Class_Create_Schema } from "./schema";
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
    class_subject,
  } = data;

  try {
    // 檢查 class_date 是否為空
    if (!class_date || class_date.length === 0) {
      return { error: "課程日期不能為空" };
    }

    // 檢查 class_course_id 是否有效
    const course = await db.course.findUnique({ where: { id: class_course_id } });
    if (!course) {
      return { error: "指定的課程不存在" };
    }

    // 檢查 classroom 是否有效
    const classroomExists = await db.classroom.findUnique({ where: { id: classroom } });
    if (!classroomExists) {
      return { error: "指定的教室不存在" };
    }

    // 批量創建 Class 記錄
    const classRecords: Class[] = [];
    for (const date of class_date) {
      const class_data = await db.class.create({
        data: {
          class_time_h,
          cram,
          classroom: { connect: { id: classroom } },
          persons,
          class_course_id,
          class_lesson,
          class_date: date,
          class_start_time,
          class_end_time,
          attend_number,
          teacher,
          node,
          grade,
          freq,
       
          title,
          allDay,
          isshow: true,
          attend_name: [],
          class_subject,
        },
      });
      classRecords.push(class_data);

      // 將 Class 關聯到 Course
      await db.course.update({
        where: { id: class_course_id },
        data: {
          class: {
            connect: { id: class_data.id },
          },
        },
      });
    }

    // 重新驗證課程列表頁面
    revalidatePath(`/admin/courseLists/${class_course_id}`);

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Class_Data -- : ", classRecords, " -- End -- ");
    }

    // 重定向到課程列表
    redirect(`/admin/courseLists/${class_course_id}`);

    return { data: classRecords };
  } catch (error) {
    console.error("創建課程失敗:", error);
    return { error: "無法創建課程記錄，請檢查輸入數據" };
  }
};

export const createClass = CreateSafeAction(Class_Create_Schema, handler);
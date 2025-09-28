// actions/supadmin/Create-AddStudent/index.ts

"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupAddStudent_Create_Schema } from "./schema";
import { Course } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { courseId, student } = data;

  try {
    const course = await db.$transaction(async (prisma) => {
      // 1. 驗證課程是否存在
      const courseRecord = await prisma.course.findUnique({
        where: { id: courseId },
      });
      if (!courseRecord) {
        throw new Error("課程不存在");
      }

      // 2. 驗證學生是否存在
      const studentRecords = await prisma.student.findMany({
        where: { name: { in: student } },
      });
      if (studentRecords.length !== student.length) {
        throw new Error("部分學生不存在");
      }

      // 3. 更新 Course，添加學生
      const course = await prisma.course.update({
        where: { id: courseId },
        data: {
          student: {
            connect: student.map((studentName: string) => ({ name: studentName })),
          },
        },
        include: {
          Teacher_data: true,
          class: { include: { student: true } },
        },
      });

      // 4. 更新 Student，設置 teachers 和 teacher_data_id，並清除舊的 Class 關聯
      const teacherNames = course.Teacher_data.map((teacher) => teacher.nickname).join(", ");
      const teacherId = course.Teacher_data[0]?.id || null;

      await prisma.student.updateMany({
        where: {
          name: { in: student },
        },
        data: {
          teachers: teacherNames,
          student_teacher_data_id: teacherId,
        },
      });

      for (const studentName of student) {
        await prisma.student.update({
          where: { name: studentName },
          data: {
            student_class: {
              set: [],
            },
          },
        });
      }

      // 5. 更新 StaffUser（教師）的 Student 關聯
      if (course.Teacher_data.length > 0) {
        await Promise.all(
          course.Teacher_data.map((teacher) =>
            prisma.staffUser.update({
              where: { id: teacher.id },
              data: {
                Student: {
                  connect: student.map((studentName: string) => ({ name: studentName })),
                },
              },
            })
          )
        );
      }

      // 6. 更新相關 Class 的學生
      const classes = await prisma.class.findMany({
        where: { class_course_id: courseId },
      });

      console.log(`找到 ${classes.length} 個 Class 與 Course ${courseId} 相關`);

      for (const cls of classes) {
        const updatedClass = await prisma.class.update({
          where: { id: cls.id },
          data: {
            student: {
              connect: student.map((studentName: string) => ({ name: studentName })),
            },
          },
          include: { student: true },
        });
        console.log(`成功更新 Class ${cls.id}，學生數據:`, updatedClass.student);
      }

      return course;
    });

    // 重新驗證相關頁面
    revalidatePath(`/admin/courseLists/${courseId}`);

    return { data: course, success: "學生添加成功" };
  } catch (error: any) {
    console.error("添加學生失敗:", error);
    return { error: error.message || "添加學生時發生錯誤" };
  }
};

export const SupcreateAddStudent = CreateSafeAction(SupAddStudent_Create_Schema, handler);
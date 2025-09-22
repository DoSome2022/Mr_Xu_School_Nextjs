"use server";

import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { AddStudent_Create_Schema } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { courseId, student } = data;

  try {
    const result = await db.$transaction(async (prisma) => {
      // 1. 更新 Course，添加學生
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

      // 檢查課程是否存在
      if (!course) {
        throw new Error("找不到指定的課程");
      }

      // 2. 更新 Student，設置 teachers 和 teacher_data，並清除舊的 Class 關聯
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

      // 清除學生與所有 Class 的現有關聯
      for (const studentName of student) {
        await prisma.student.update({
          where: { name: studentName },
          data: {
            student_class: {
              set: [], // 清除舊關聯
            },
          },
        });
      }

      // 3. 更新 StaffUser（教師）的 Student 關聯
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

      // 4. 更新相關 Class 的學生
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

      return course; // 返回 Course 物件
    });

    return { data: result };
  } catch (error) {
    console.error("添加學生失敗:", error);
    return { error: "添加學生時發生錯誤" };
  }
};

export const createAddStudent = CreateSafeAction(AddStudent_Create_Schema, handler);


// "use server";

// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { AddStudent_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { courseId, student } = data;

//   try {
//     const result = await db.$transaction(async (prisma) => {
//       // 1. 更新 Course，添加學生
//       const course = await prisma.course.update({
//         where: { id: courseId },
//         data: {
//           student: {
//             connect: student.map((studentName: string) => ({ name: studentName })),
//           },
//         },
//         include: {
//           Teacher_data: true,
//           class: { include: { student: true } },
//         },
//       });

//       // 檢查課程是否存在
//       if (!course) {
//         throw new Error("找不到指定的課程");
//       }

//       // 2. 更新 Student，設置 teachers 和 teacher_data，並清除舊的 Class 關聯
//       const teacherNames = course.Teacher_data.map((teacher) => teacher.nickname).join(", ");
//       const teacherId = course.Teacher_data[0]?.id || null;

//       await prisma.student.updateMany({
//         where: {
//           name: { in: student },
//         },
//         data: {
//           teachers: teacherNames,
//           student_teacher_data_id: teacherId,
//         },
//       });

//       // 清除學生與所有 Class 的現有關聯
//       for (const studentName of student) {
//         await prisma.student.update({
//           where: { name: studentName },
//           data: {
//             student_class: {
//               set: [], // 清除舊關聯
//             },
//           },
//         });
//       }

//       // 3. 更新 StaffUser（教師）的 Student 關聯
//       if (course.Teacher_data.length > 0) {
//         await Promise.all(
//           course.Teacher_data.map((teacher) =>
//             prisma.staffUser.update({
//               where: { id: teacher.id },
//               data: {
//                 Student: {
//                   connect: student.map((studentName: string) => ({ name: studentName })),
//                 },
//               },
//             })
//           )
//         );
//       }

//       // 4. 更新相關 Class 的學生
//       const classes = await prisma.class.findMany({
//         where: { class_course_id: courseId },
//       });

//       console.log(`找到 ${classes.length} 個 Class 與 Course ${courseId} 相關`);

//       for (const cls of classes) {
//         const updatedClass = await prisma.class.update({
//           where: { id: cls.id },
//           data: {
//             student: {
//               connect: student.map((studentName: string) => ({ name: studentName })),
//             },
//           },
//           include: { student: true },
//         });
//         console.log(`成功更新 Class ${cls.id}，學生數據:`, updatedClass.student);
//       }

//       return course; // 返回 Course 物件
//     });

//     // 成功後重定向
//     redirect(`/admin/courseLists/${courseId}`);

//     // 返回 Course 物件，符合 ReturnType
//     return { data: result };
//   } catch (error) {
//     console.error("添加學生失敗:", error);
//     return { error: "添加學生時發生錯誤" };
//   }
// };

// export const createAddStudent = CreateSafeAction(AddStudent_Create_Schema, handler);
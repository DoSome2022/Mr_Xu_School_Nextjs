// import { z } from "zod";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { JoinStudent_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";

// type InputType = z.infer<typeof JoinStudent_Create_Schema>;
// type ReturnType = { error?: string; data?: { message: string } };

// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { courseid, studentId, student, course_name, targetcourseId } = data;
// let joinStudent ;
//   try {
//     // 驗證輸入
//     if (!courseid || !studentId || !student || student.length === 0) {
//       return { error: "缺少必要的欄位：課程ID、學生ID或學生名稱" };
//     }

//     // 使用 Prisma 事務確保操作原子性
//     joinStudent =  await db.$transaction(async (prisma) => {
//       // 獲取課程及其相關班級和教師
//       const course = await prisma.course.findUnique({
//         where: { id: courseid },
//         include: {
//           class: true,
//           Teacher_data: true,
//         },
//       });

//       if (!course) {
//         throw new Error("課程不存在");
//       }

//       // 獲取學生
//       const studentData = await prisma.student.findUnique({
//         where: { id: studentId },
//       });

//       if (!studentData) {
//         throw new Error("學生不存在");
//       }

//       // 1. 將學生添加到 Course.student (CourseToStudent 關聯)
//       await prisma.course.update({
//         where: { id: courseid },
//         data: {
//           student: {
//             connect: { id: studentId },
//           },
//         },
//       });

//       // 2. 將學生添加到課程的所有班級 (Class.student 關聯)
//       if (course.class.length > 0) {
//         await prisma.class.updateMany({
//           where: { id: { in: course.class.map((c) => c.id) } },
//           data: {
//             student: {
//               connect: { id: studentId },
//             },
//           },
//         });
//       }

//       // 3. 將學生添加到課程教師的 StaffUser.Student 關聯
//       if (course.Teacher_data.length > 0) {
//         await prisma.staffUser.updateMany({
//           where: { id: { in: course.Teacher_data.map((t) => t.id) } },
//           data: {
//             Student: {
//               connect: { id: studentId },
//             },
//           },
//         });
//       }

//       // 4. 將課程添加到學生的 Student.course 關聯
//       await prisma.student.update({
//         where: { id: studentId },
//         data: {
//           course: {
//             connect: { id: courseid },
//           },
//         },
//       });

//       // 5. 將課程的所有班級添加到學生的 Student.student_class 關聯
//       if (course.class.length > 0) {
//         await prisma.student.update({
//           where: { id: studentId },
//           data: {
//             student_class: {
//               connect: course.class.map((c) => ({ id: c.id })),
//             },
//           },
//         });
//       }

//       // 6. 在 JoinStudent 模型中創建記錄
//       await prisma.joinStudent.create({
//         data: {
//           courseid,
//           studentId,
//           student_name: studentData.name,
//           course_name,
//           targetcourseId: courseid,
//           // targetclassId: targetcourseId || course.class[0]?.id || "", // 如果未提供 targetclassId，使用課程的第一個班級ID
//         },
//       });
//     });

//     // 操作成功後重定向到課程詳情頁面
//   } catch (error) {
//     // console.error("添加學生失敗:", error);
    
//     console.log("-- error -- : ", error, " -- End -- ");
//   }


//     console.log("joinStudent : ",joinStudent,"-- end --")
//   return redirect(`/supadmin/${}/courseLists/${courseid}`);
  
// };

// export const createJoinStudent = CreateSafeAction(JoinStudent_Create_Schema, handler);

"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupJoinStudent_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

type InputType = z.infer<typeof SupJoinStudent_Create_Schema>;
type ReturnType = { error?: string; data?: { message: string } };

const handler = async (data: InputType): Promise<ReturnType> => {
  const { courseid, studentId, student, course_name, targetcourseId , supadminId} = data;

  try {
    // 驗證輸入
    if (!courseid || !studentId || !student || student.length === 0) {
      return { error: "缺少必要的欄位：課程ID、學生ID或學生名稱" };
    }

    // 使用 Prisma 事務確保操作原子性
    const joinStudent = await db.$transaction(async (prisma) => {
      // 獲取課程及其相關班級和教師
      const course = await prisma.course.findUnique({
        where: { id: courseid },
        include: {
          class: true,
          Teacher_data: true,
        },
      });

      if (!course) {
        throw new Error("課程不存在");
      }

      // 獲取學生
      const studentData = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!studentData) {
        throw new Error("學生不存在");
      }

      // 1. 將學生添加到 Course.student (CourseToStudent 關聯)
      await prisma.course.update({
        where: { id: courseid },
        data: {
          student: {
            connect: { id: studentId },
          },
        },
      });

      // 2. 將學生添加到課程的所有班級 (Class.student 關聯)
      if (course.class.length > 0) {
        for (const classItem of course.class) {
          await prisma.class.update({
            where: { id: classItem.id },
            data: {
              student: {
                connect: { id: studentId },
              },
            },
          });
        }
      }

      // 3. 將學生添加到課程教師的 StaffUser.Student 關聯
      if (course.Teacher_data.length > 0) {
        for (const teacher of course.Teacher_data) {
          await prisma.staffUser.update({
            where: { id: teacher.id },
            data: {
              Student: {
                connect: { id: studentId },
              },
            },
          });
        }
      }

      // 4. 將課程添加到學生的 Student.course 關聯
      await prisma.student.update({
        where: { id: studentId },
        data: {
          course: {
            connect: { id: courseid },
          },
        },
      });

      // 5. 將課程的所有班級添加到學生的 Student.student_class 關聯
      if (course.class.length > 0) {
        await prisma.student.update({
          where: { id: studentId },
          data: {
            student_class: {
              connect: course.class.map((c) => ({ id: c.id })),
            },
          },
        });
      }

      // 6. 在 JoinStudent 模型中創建記錄
      return await prisma.joinStudent.create({
        data: {
          courseid,
          studentId,
          student_name: studentData.name,
          course_name,
          targetcourseId: courseid,
        },
      });
    });

    // 操作成功後重定向
    // redirect(`/supadmin/${}/courseLists/${courseid}`);
    // return { data: { message: "學生成功加入課程" } };

    revalidatePath(`/supadmin/${supadminId}/courseLists/${courseid}`)
  } catch (error: any) {
    console.error("添加學生失敗:", error);
    return { error: error.message || "添加學生時發生錯誤" };
  }

  return redirect(`/supadmin/${supadminId}/courseLists/${courseid}`);
};

export const SupcreateJoinStudent = CreateSafeAction(SupJoinStudent_Create_Schema, handler);
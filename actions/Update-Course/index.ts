// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Course_Update_Schema } from "./schema";
// import { redirect } from "next/navigation";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {courseId, course_name , course_subject , course_level , persons , grade , teacher , course_teacher_data_id} = data;

//     let course_data;

//     try {
//         course_data = await db.course.update({
//             where:{
//                 id: courseId
//             },
//             data:{
//                 course_name : course_name,
//                 course_subject : course_subject,
//                 course_level : course_level,
//                 persons : persons,
//                 grade: grade ,
//                 teacher: teacher,
//                 course_teacher_data_id : course_teacher_data_id
//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- Course_Update_Data -- : " , course_data , " -- End -- ")
//     return redirect(`/admin/courseLists/${courseId}`)
// }

// export const update_Course = CreateSafeAction(Course_Update_Schema, handler)



"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Course_Update_Schema } from "./schema";
import { redirect } from "next/navigation";
import { Course } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { courseId, course_name, course_subject, persons, grade, teacher, course_teacher_data_id } = data;

  let course_data: Course | undefined;

  try {
    // 驗證 courseId 是否存在
    const courseRecord = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!courseRecord) {
      return { error: "課程不存在" };
    }

    // 驗證 course_teacher_data_id 是否存在
    if (course_teacher_data_id && course_teacher_data_id.length > 0) {
      const teacherRecords = await db.staffUser.findMany({
        where: { id: { in: course_teacher_data_id } },
      });
      if (teacherRecords.length !== course_teacher_data_id.length) {
        return { error: "部分教師數據不存在" };
      }
    }

    // 驗證 teacher 是否存在
    const teacherRecord = await db.staffUser.findFirst({
      where: { username: teacher },
    });
    if (!teacherRecord) {
      return { error: "教師不存在" };
    }

    course_data = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        course_name,
        course_subject,
        persons,
        grade,
        teacher,
        Teacher_data: course_teacher_data_id && course_teacher_data_id.length > 0
          ? { set: course_teacher_data_id.map(id => ({ id })) } // 更新多對多關係
          : { set: [] }, // 清空關係
      },
    });

    // 記錄成功更新（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- Course_Update_Data -- : ", course_data, " -- End -- ");
    }

    // 重新驗證相關頁面
    revalidatePath(`/admin/courseLists/${courseId}`);

    // 重定向
    redirect(`/admin/courseLists/${courseId}`);

    return { data: course_data, success: "課程更新成功" };
  } catch (error: any) {
    console.error("更新課程失敗:", error);
    return {
      error: error.message || "更新課程失敗，請檢查輸入數據",
    };
  }
};

export const update_Course = CreateSafeAction(Course_Update_Schema, handler);
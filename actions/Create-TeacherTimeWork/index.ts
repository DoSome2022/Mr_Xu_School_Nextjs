"use server";

import { revalidatePath } from "next/cache"; 
import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Teacher_time_work_Create_Schema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {
        P_HR,
        JHS_HR,
        HS_HR,
        P_number,
        JHS_number,
        HS_number,
        teacherId,
        classId, // 新增 classId
    } = data;

    const currentYear = new Date().getFullYear().toString();
    const currentMonth = (new Date().getMonth() + 1).toString();

    let teacherTimeWork;

    try {
        // 檢查是否已有該教師該月的記錄
        teacherTimeWork = await db.teacher_time_work.findFirst({
            where: {
                teacher_time_work_id: teacherId,
                year: currentYear,
                month: currentMonth,
            },
        });

        if (teacherTimeWork) {
            // 如果已有記錄，更新數據
            teacherTimeWork = await db.teacher_time_work.update({
                where: {
                    id: teacherTimeWork.id,
                },
                data: {
                    P_HR: teacherTimeWork.P_HR + P_HR,
                    JHS_HR: teacherTimeWork.JHS_HR + JHS_HR,
                    HS_HR: teacherTimeWork.HS_HR + HS_HR,
                    P_number: teacherTimeWork.P_number + P_number,
                    JHS_number: teacherTimeWork.JHS_number + JHS_number,
                    HS_number: teacherTimeWork.HS_number + HS_number,
                    class_time_work_id: classId, // 更新 class_time_work_id
                },
            });
        } else {
            // 如果沒有記錄，創建新記錄
            teacherTimeWork = await db.teacher_time_work.create({
                data: {
                    year: currentYear,
                    month: currentMonth,
                    P_HR,
                    JHS_HR,
                    HS_HR,
                    P_number,
                    JHS_number,
                    HS_number,
                    teacher_time_work_id: teacherId,
                    class_time_work_id: classId, // 設置 class_time_work_id
                },
            });
        }
    } catch (error) {
        console.error("Error creating/updating teacher time work:", error);
        return { error: "Failed to process teacher time work" };
    }

    console.log("-- teacher_time_work_Data -- : ", teacherTimeWork, " -- End -- ");
    return { data: teacherTimeWork };
};

export const createTeacherTimeWork = CreateSafeAction(Teacher_time_work_Create_Schema, handler);

// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType, ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Teacher_time_work_Create_Schema } from "./schema";

// const handler = async (data: InputType): Promise<ReturnType> => {
//     const {
//         P_HR,
//         JHS_HR,
//         HS_HR,
//         P_number,
//         JHS_number,
//         HS_number,
//         teacherId
//     } = data;

//     let teacher_time_work_data;

//     try {
//         // 檢查是否已有該教師該月份的記錄，若有則更新，否則創建
//         const currentYear = new Date().getFullYear().toString();
//         const currentMonth = (new Date().getMonth() + 1).toString();

//         const existingRecord = await db.teacher_time_work.findFirst({
//             where: {
//                 teacher_time_work_id: teacherId,
//                 year: currentYear,
//                 month: currentMonth,
//             },
//         });

//         if (existingRecord) {
//             // 更新現有記錄
//             teacher_time_work_data = await db.teacher_time_work.update({
//                 where: {
//                     id: existingRecord.id,
//                 },
//                 data: {
//                     P_HR: existingRecord.P_HR + P_HR,
//                     JHS_HR: existingRecord.JHS_HR + JHS_HR,
//                     HS_HR: existingRecord.HS_HR + HS_HR,
//                     P_number: existingRecord.P_number + P_number,
//                     JHS_number: existingRecord.JHS_number + JHS_number,
//                     HS_number: existingRecord.HS_number + HS_number,
//                 },
//             });
//         } else {
//             // 創建新記錄
//             teacher_time_work_data = await db.teacher_time_work.create({
//                 data: {
//                     year: currentYear,
//                     month: currentMonth,
//                     P_HR,
//                     JHS_HR,
//                     HS_HR,
//                     P_number,
//                     JHS_number,
//                     HS_number,
//                     teacher_time_work_id: teacherId,
//                 },
//             });
//         }
//     } catch (error) {
//         console.log(error);
//         return { error: "Failed to create or update teacher time work" };
//     }

//     console.log("-- teacher_time_work_Data -- : ", teacher_time_work_data, " -- End -- ");
//     return { data: teacher_time_work_data };
// };

// export const createTeacherTimeWork = CreateSafeAction(Teacher_time_work_Create_Schema, handler);
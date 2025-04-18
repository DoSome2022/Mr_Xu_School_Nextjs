"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { AttenDance_Create_Schema } from "./schema";
import { z } from "zod";

// 定義批量處理的輸入類型
type BatchInputType = InputType[];

// 修改 handler 以支持批量處理並更新 Class
const handler = async (data: BatchInputType): Promise<ReturnType> => {
    try {
        // 創建所有學生的 AttenDance 記錄
        const attendanceRecords = await db.attenDance.createMany({
            data: data.map(item => ({
                classroomId: item.classroomId,
                studentId: item.studentId,
                isPresent: item.isPresent,
                isLate: item.isLate,
            })),
        });

        // 獲取 classroomId（假設所有記錄的 classroomId 相同）
        const classroomId = data[0].classroomId;

        // 過濾出 isPresent 為 true 的學生
        const presentStudents = data.filter(item => item.isPresent);

        // 從 Student 表中查詢這些學生的名字
        const studentIds = presentStudents.map(item => item.studentId);
        const students = await db.student.findMany({
            where: {
                id: { in: studentIds },
            },
            select: {
                name: true,
            },
        });

        const attendNames = students.map(student => student.name);

        // 更新 Class 表
        await db.class.update({
            where: {
                id: classroomId,
            },
            data: {
                attend_name: attendNames,
                attend_number: attendNames.length,
                isSubmittedform: true,
            },
        });

        console.log("-- AttenDance_data created and Class updated --");
        return { data: attendanceRecords };
    } catch (error) {
        console.error("Error creating attendance or updating class:", error);
        return { error: "Failed to process attendance" };
    }
};

// 更新 schema 以支持陣列輸入
export const createAttenDance = CreateSafeAction(z.array(AttenDance_Create_Schema), handler);

// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { AttenDance_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {
//             classroomId,
//             studentId,
//             isPresent,
//             isLate
//         } = data;

//     let AttenDance_data;

//     try {
//         AttenDance_data = await db.attenDance.create({
//             data:{
//                classroomId : classroomId,
//                studentId : studentId,
//                isPresent : isPresent,
//                isLate : isLate 
//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- AttenDance_data -- : " , AttenDance_data , " -- End -- ")
//     return { data: AttenDance_data }
    
// }

// export const createAttenDance = CreateSafeAction(AttenDance_Create_Schema, handler)
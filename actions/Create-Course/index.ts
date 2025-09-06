"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Course_Create_Schema } from "./schema";
import { redirect } from "next/navigation";



// 計算課程時長（小時）
function calculateClassHours(startTime: string, endTime: string): number {
    try {
        const start = parseInt(startTime);
        const end = parseInt(endTime);

        if (isNaN(start) || isNaN(end)) {
            throw new Error("無效的時間格式");
        }

        const startHours = Math.floor(start / 100);
        const startMinutes = start % 100;
        const endHours = Math.floor(end / 100);
        const endMinutes = end % 100;

        const startTotalMinutes = startHours * 60 + startMinutes;
        const endTotalMinutes = endHours * 60 + endMinutes;

        const durationHours = (endTotalMinutes - startTotalMinutes) / 60;

        if (durationHours <= 0) {
            throw new Error("結束時間必須晚於開始時間");
        }

        return durationHours;
    } catch (error) {
        console.error("計算課程時長錯誤:", error);
        throw new Error("無法計算課程時長，請檢查時間格式");
    }
}



const handler = async (data: InputType): Promise<ReturnType> => {
    const {
        course_name,
        persons,
        teacher,
        course_teacher_data_id,
        TimeTemplateID,
        day_start,
        day_end,
        start_time,
        end_time,
        days,
        weekdays,
        publicholiday,
        grade,
        course_subject,
        classroom,
    } = data;

    // 驗證 course_subject
    if (!course_subject) {
        return { error: "課程科目 (course_subject) 為必填欄位" };
    }

    // 驗證 classroom 是否存在
    const classroomRecord = await db.classroom.findUnique({
        where: { id: classroom },
    });
    if (!classroomRecord) {
        return { error: `教室 ${classroom} 不存在` };
    }

    let course_data;

    try {
        const validatedDays = Array.isArray(days) ? days : [];
        const validatedWeekdays = Array.isArray(weekdays)
            ? weekdays.map((item) => item.date)
            : [];

        // 合併並去重所有日期
        const allDates = [...new Set([
            ...validatedDays.map(day => day.date),
            ...validatedWeekdays
        ])].filter(date => date);

        course_data = await db.$transaction(async (prisma) => {
            const course = await prisma.course.create({
                data: {
                    course_name,
                    persons,
                    grade,
                    teacher,
                    course_subject,
                    course_teacher_data_id,
                    day_start,
                    day_end,
                    start_time,
                    end_time,
                    days: validatedDays,
                    weekdays: validatedWeekdays,
                    publicholiday_model: publicholiday,
                    TimeTemplate: {
                        connect: { id: TimeTemplateID },
                    },
                    Teacher_data: {
                        connect: course_teacher_data_id.map(id => ({ id })),
                    },
                    classroom: {
                        connect: { id: classroom }, // 將 Course 與 Classroom 關聯
                    },
                    isshow: true,
                },
                include: {
                    Teacher_data: true,
                    classroom: true, // 可選：包含關聯的 classroom 數據以便檢查
                },
            });

            const classPromises = allDates.map(async (date) => {
                const dayInfo = validatedDays.find(d => d.date === date);
                const lesson = dayInfo ? dayInfo.lesson : "1";

                return prisma.class.create({
                    data: {
                        class_time_h: calculateClassHours(start_time, end_time),
                        cram: "",
                        classroom: {
                            connect: { id: classroom },
                        },
                        class_course: {
                            connect: { id: course.id },
                        },
                        class_lesson: lesson,
                        class_start_time: start_time,
                        class_end_time: end_time,
                        class_subject: course_subject,
                        teacher,
                        grade,
                        node: isNaN(parseInt(lesson)) ? 1 : parseInt(lesson),
                        attend_number: 0,
                        class_date: date,
                        persons,
                        freq: "weekly",
                        title: `${course_name} - ${date}`,
                        allDay: false,
                        isshow: true,
                    },
                });
            });

            const classes = await Promise.all(classPromises);

            return {
                ...course,
                classes,
            };
        });

        console.log("-- Course_Data -- : ", course_data, " -- End -- ");
    } catch (error) {
        console.error("建立課程錯誤:", error);
        return { error: "建立課程失敗，請檢查輸入數據" };
    }

    // 成功後執行重定向（移出 try-catch）
    return redirect("/admin/courseLists");
};
export const create_Course = CreateSafeAction(Course_Create_Schema, handler);


// "use server";

// import { revalidatePath } from "next/cache";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Course_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";

// const handler = async (data: InputType): Promise<ReturnType> => {
//     const {
//         course_name,
//         persons,
//         teacher,
//         course_teacher_data_id,
//         TimeTemplateID,
//         day_start,
//         day_end,
//         start_time,
//         end_time,
//         days,
//         weekdays,
//         publicholiday,
//         grade,
//         course_subject,
//         classroom,
//     } = data;

//     // 驗證 course_subject
//     if (!course_subject) {
//         return { error: "課程科目 (course_subject) 為必填欄位" };
//     }

//     let course_data;

//     try {
//         const validatedDays = Array.isArray(days) ? days : [];
//         const validatedWeekdays = Array.isArray(weekdays)
//             ? weekdays.map((item) => item.date)
//             : [];

//         // 合併所有日期 (days + weekdays)
//         const allDates = [
//             ...validatedDays.map(day => day.date),
//             ...validatedWeekdays
//         ].filter(date => date);

//         course_data = await db.$transaction(async (prisma) => {
//             const course = await prisma.course.create({
//                 data: {
//                     course_name,
//                     persons,
//                     grade,
//                     teacher,
//                     course_subject, // 現在保證是 string
//                     course_teacher_data_id,
//                     day_start,
//                     day_end,
//                     start_time,
//                     end_time,
//                     days: validatedDays,
//                     weekdays: validatedWeekdays,
//                     publicholiday_model: publicholiday,
//                     TimeTemplate: {
//                         connect: { id: TimeTemplateID },
//                     },
//                     Teacher_data: {
//                         connect: course_teacher_data_id.map(id => ({ id })),
//                     },
//                     isshow: true,
//                 },
//                 include: {
//                     Teacher_data: true,
//                 },
//             });

//             const classPromises = allDates.map(async (date) => {
//                 const dayInfo = validatedDays.find(d => d.date === date);
//                 const lesson = dayInfo ? dayInfo.lesson : "1";

//                 return prisma.class.create({
//                     data: {
//                         class_time_h: calculateClassHours(start_time, end_time),
//                         cram: "",
//                         classroom: classroom,
//                         class_course: {
//                             connect: { id: course.id }
//                         },
//                         class_lesson: lesson,
//                         class_start_time: start_time,
//                         class_end_time: end_time,
//                         class_subject: course_subject, // 也保證是 string
//                         teacher,
//                         grade,
//                         node: isNaN(parseInt(lesson)) ? 1 : parseInt(lesson),
//                         attend_number: 0,
//                         class_date: date,
//                         persons,
//                         freq: "weekly",
//                         title: `${course_name} - ${date}`,
//                         allDay: false,
//                         isshow: true,
//                     },
//                 });
//             });

//             const classes = await Promise.all(classPromises);

//             return {
//                 ...course,
//                 classes,
//             };
//         });

//     } catch (error) {
//         console.error("建立課程錯誤:", error);
//         return { error: "建立課程失敗" };
//     }

//     console.log("-- Course_Data -- : ", course_data, " -- End -- ");
//     revalidatePath("/admin/courseLists");
//     redirect("/admin/courseLists");
// };

// // 計算課程時長（小時）
// function calculateClassHours(startTime: string, endTime: string): number {
//     const start = parseInt(startTime);
//     const end = parseInt(endTime);
//     return (end - start) / 100;
// }

// export const create_Course = CreateSafeAction(Course_Create_Schema, handler);


















//18-08-2025

// "use server";

// import { revalidatePath } from "next/cache";
// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Course_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";

// const handler = async (data: InputType): Promise<ReturnType> => {
//     const {
//         course_name,
//         persons,
//         teacher,
//         course_teacher_data_id,
//         TimeTemplateID,
//         day_start,
//         day_end,
//         start_time,
//         end_time,
//         days,
//         weekdays,
//         publicholiday,
//         grade,
//         course_subject,
//         classroom,
//     } = data;

//     // 驗證 course_subject
//     if (!course_subject) {
//         return { error: "課程科目 (course_subject) 為必填欄位" };
//     }

//     // 驗證 classroom 是否存在
//     const classroomRecord = await db.classroom.findUnique({
//         where: { id: classroom }, // 假設 classroom 是 id
//     });
//     if (!classroomRecord) {
//         return { error: `教室 ${classroom} 不存在` };
//     }

//     let course_data;

//     try {
//         const validatedDays = Array.isArray(days) ? days : [];
//         const validatedWeekdays = Array.isArray(weekdays)
//             ? weekdays.map((item) => item.date)
//             : [];

//         // 合併並去重所有日期
//         const allDates = [...new Set([
//             ...validatedDays.map(day => day.date),
//             ...validatedWeekdays
//         ])].filter(date => date);

//         course_data = await db.$transaction(async (prisma) => {
//             const course = await prisma.course.create({
//                 data: {
//                     course_name,
//                     persons,
//                     grade,
//                     teacher,
//                     course_subject,
//                     course_teacher_data_id,
//                     day_start,
//                     day_end,
//                     start_time,
//                     end_time,
//                     days: validatedDays,
//                     weekdays: validatedWeekdays,
//                     publicholiday_model: publicholiday,
//                     TimeTemplate: {
//                         connect: { id: TimeTemplateID },
//                     },
//                     Teacher_data: {
//                         connect: course_teacher_data_id.map(id => ({ id })),
//                     },
//                     isshow: true,
//                 },
//                 include: {
//                     Teacher_data: true,
//                 },
//             });

//             const classPromises = allDates.map(async (date) => {
//                 const dayInfo = validatedDays.find(d => d.date === date);
//                 const lesson = dayInfo ? dayInfo.lesson : "1";

//                 return prisma.class.create({
//                     data: {
//                         class_time_h: calculateClassHours(start_time, end_time),
//                         cram: "",
//                         classroom: {
//                             connect: { id: classroom },
//                         },
//                         class_course: {
//                             connect: { id: course.id }
//                         },
//                         class_lesson: lesson,
//                         class_start_time: start_time,
//                         class_end_time: end_time,
//                         class_subject: course_subject,
//                         teacher,
//                         grade,
//                         node: isNaN(parseInt(lesson)) ? 1 : parseInt(lesson),
//                         attend_number: 0,
//                         class_date: date,
//                         persons,
//                         freq: "weekly",
//                         title: `${course_name} - ${date}`,
//                         allDay: false,
//                         isshow: true,
//                     },
//                 });
//             });

//             const classes = await Promise.all(classPromises);

//             return {
//                 ...course,
//                 classes,
//             };
//         });

//         // console.log("-- Course_Data -- : ", course_data, " -- End -- ");
//         // revalidatePath("/admin/courseLists");
//         // redirect("/admin/courseLists");
//     } catch (error) {
//         console.error("建立課程錯誤:", error);
//         return { error: "建立課程失敗，請檢查輸入數據" };
//     }

//     console.log("-- Course_Data -- : ", course_data, " -- End -- ");
//     // revalidatePath("/admin/courseLists");
//   return redirect("/admin/courseLists");
// };

// // 計算課程時長（小時）
// function calculateClassHours(startTime: string, endTime: string): number {
//     const start = parseInt(startTime);
//     const end = parseInt(endTime);
//     if (isNaN(start) || isNaN(end)) {
//         throw new Error("無效的時間格式");
//     }
//     return (end - start) / 100;
// }

// export const create_Course = CreateSafeAction(Course_Create_Schema, handler);
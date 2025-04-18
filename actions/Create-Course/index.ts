"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Course_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

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

    let course_data;

    try {
        const validatedDays = Array.isArray(days) ? days : [];
        const validatedWeekdays = Array.isArray(weekdays)
            ? weekdays.map((item) => item.date)
            : [];

        // 合併所有日期 (days + weekdays)
        const allDates = [
            ...validatedDays.map(day => day.date), 
            ...validatedWeekdays
        ].filter(date => date); // 過濾掉空值

        // 使用事務確保所有操作要麼全部成功，要麼全部失敗
        course_data = await db.$transaction(async (prisma) => {
            // 1. 首先建立課程
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
                },
                include: {
                    Teacher_data: true,
                },
            });

            // 2. 為每個日期建立 Class
            const classPromises = allDates.map(async (date) => {
                // 從 days 中找出對應的 lesson 資訊
                const dayInfo = validatedDays.find(d => d.date === date);
                const lesson = dayInfo ? dayInfo.lesson : "1"; // 預設為第1節課

                return prisma.class.create({
                    data: {
                        class_time_h: calculateClassHours(start_time, end_time),
                        cram: "", // 根據需要填寫
                        classroom: classroom, // 根據需要填寫
                        class_course_id: course.id,
                        class_lesson: lesson,
                        class_start_time: start_time,
                        class_end_time: end_time,
                        class_subject: course_subject,
                        teacher,
                        grade,
                        node: parseInt(lesson), // 假設 node 對應 lesson
                        attend_number: 0, // 初始為0
                        class_date: date,
                        persons,
                        freq: "weekly", // 或其他適當值
                        title: `${course_name} - ${date}`,
                        allDay: false,
                    },
                });
            });

            const classes = await Promise.all(classPromises);

            return {
                ...course,
                classes, // 包含所有建立的 class
            };
        });

    } catch (error) {
        console.error("建立課程錯誤:", error);
        return { error: "建立課程失敗" };
    }

    console.log("-- Course_Data -- : ", course_data, " -- End -- ");
    revalidatePath("/admin/courseLists");
    redirect("/admin/courseLists");
};

// 輔助函數：計算課程時長（小時）
function calculateClassHours(startTime: string, endTime: string): number {
    const start = parseInt(startTime);
    const end = parseInt(endTime);
    return (end - start) / 100; // 假設時間格式為 "0900" 這樣的形式
}

export const create_Course = CreateSafeAction(Course_Create_Schema, handler);




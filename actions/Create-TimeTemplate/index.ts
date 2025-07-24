"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { timetemplate_create_Schema } from "./schema";
import { redirect } from "next/navigation";

// 驗證並格式化日期的輔助函數
const formatDateString = (dateInput:any) => {
    if (!dateInput || typeof dateInput !== "string") return null;
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
};

const generateWeekdays = (
    day_start: Date,
    day_end: Date,
    start_time: string,
    end_time: string,
    lesson: string
): Array<{ date: string; start_time: string; end_time: string; lesson: string }> => {
    const weekdays = [];
    const currentDate = new Date(day_start);
    const endDate = new Date(day_end);

    while (currentDate <= endDate) {
        if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // Monday to Friday
            weekdays.push({
                date: currentDate.toISOString().split("T")[0],
                start_time,
                end_time,
                lesson,
            });
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return weekdays;
};

const generateDays = (
    selectedDays: Array<Date>,
    start_time: string,
    end_time: string,
    lesson: string
): Array<{ date: string; start_time: string; end_time: string; lesson: string }> => {
    return selectedDays
        .filter((day) => day instanceof Date && !isNaN(day.getTime())) // 過濾無效日期
        .map((day) => ({
            date: day.toISOString().split("T")[0],
            start_time,
            end_time,
            lesson,
        }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const handler = async (data: InputType): Promise<ReturnType> => {
    const {
        title,
        day_start,
        day_end,
        publicholiday,
        weekdays,
        days,
        start_time,
        end_time,
        lesson,
    } = data;

    let timetemplate_data;

    console.log("lesson data : ", data, "-- END --");

    try {
        const parsedDayStart = new Date(day_start);
        const parsedDayEnd = new Date(day_end);

        if (isNaN(parsedDayStart.getTime()) || isNaN(parsedDayEnd.getTime())) {
            throw new Error("Invalid day_start or day_end value");
        }

        // 從 days 對象中提取日期，並轉換為 Date 物件
        const parsedDays = days.map((dayObj:any) => {
            const dateStr = dayObj.date; // 假設 days 是 [{ date: "2025-03-01", ... }, ...]
            const parsedDate = new Date(dateStr);
            if (isNaN(parsedDate.getTime())) {
                console.warn(`Invalid date in days: ${dateStr}`);
                return null;
            }
            return parsedDate;
        }).filter((d:any) => d !== null); // 過濾無效日期

        const generatedWeekdays = generateWeekdays(parsedDayStart, parsedDayEnd, start_time, end_time, lesson);
        const generatedDays = generateDays(parsedDays, start_time, end_time, lesson);

        timetemplate_data = await db.timetemplate.create({
            data: {
                title,
                day_start: parsedDayStart.toISOString().split("T")[0],
                day_end: parsedDayEnd.toISOString().split("T")[0],
                publicholiday_model: publicholiday,
                weekdays: weekdays,
                days: days, // 保留原始 days 格式，因為 schema 要求對象陣列
                lesson,
                start_time,
                end_time,
            },
        });
    } catch (error:any) {
        console.error("Error creating timetemplate:", error);
        return {
            error: error.message || "Failed to create timetemplate due to invalid data",
        };
    }

    console.log("-- timetemplate_data -- : ", timetemplate_data, " -- End -- ");
    revalidatePath("/admin/timetemplateLists"); // 如果需要更新緩存
    return redirect("/admin/timetemplateLists");
};

export const createtimetemplate = CreateSafeAction(timetemplate_create_Schema, handler);
"use server";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupSchool_Ex_Day_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {
        supadminid,
        school_ex_day_id,
        subject,
        grade,
        year, // 保持为字符串，例如 "0000-0001"
        quarter,
        EX_Day,
        title,
    } = data;

    let School_Ex_Day_data;

    try {
        School_Ex_Day_data = await db.school_EX_Day.create({
            data: {
                school_ex_day_id: school_ex_day_id,
                subject: subject,
                grade: grade,
                year: year, // 直接使用原始字符串
                quarter: quarter,
                EX_Day: EX_Day,
                title: title,
            },
        });
    } catch (error) {
        console.log(error);
        return { error: "创建失败" }; // 添加错误返回
    }

    console.log("-- School_Ex_Day_data -- : ", School_Ex_Day_data, " -- End -- ");
    return redirect(`/admin/${supadminid}/schoolLists/${school_ex_day_id}`);
};

export const SupcreateSchool_Ex_Day_data_action = CreateSafeAction(SupSchool_Ex_Day_Schema, handler);
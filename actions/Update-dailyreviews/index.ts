"use server";


import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Update_Dailyreviews_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
    const {id, title , content , student_id , teacher_id } = data;

    let dailyreviews_data;

    try {
        dailyreviews_data = await db.dailyreviews.update({
            where:{
                id : id
            },


            data:{
                title : title,
                content : content,
                student_id : student_id,
                teacher_id : teacher_id
            }
        });

        revalidatePath(`/teacher/${teacher_id}/studentLists/${student_id}`)
    } catch (error) {
        console.error("建立課程錯誤:", error);
        return { error: "建立課程失敗" };
    }
    console.log("-- Create_dailyreviews_Data -- : ", dailyreviews_data ,"-- End --")
    return redirect(`/teacher/${teacher_id}/studentLists/${student_id}`);
    
};

export const update_dailyreviews = CreateSafeAction(Update_Dailyreviews_Schema,handler);
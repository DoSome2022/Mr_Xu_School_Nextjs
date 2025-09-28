"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { News_Update_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {NewId , title , content , date} = data;

    let news_data;

    try {
        news_data = await db.news.update({
            where:{
                id : NewId
            },
            data:{
                title : title,
                content : content,
                date: date
            }
        });
        revalidatePath(`/admin/newsLists`)
        
    } catch (error) {
        console.log(error)
        return { error: "Error updating news" };
    }
    console.log("-- News_update_Data -- : " , news_data , " -- End -- ")
    return redirect(`/admin/newsLists`);
}

export const update_News_action = CreateSafeAction(News_Update_Schema, handler)
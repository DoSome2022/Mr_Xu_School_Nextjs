"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupNews_Update_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {NewId , title , content , date , supadminid } = data;

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
        revalidatePath(`/supadmin/${supadminid}/newLists`)
        
    } catch (error) {
        console.log(error)
        return { error: "Error updating news" };
    }
    console.log("-- News_update_Data -- : " , news_data , " -- End -- ")
    return { data: news_data , success: "News updated successfully" }

    // return redirect(`/supadmin/${supadminid}/newLists`)
}

export const Supupdate_News_action = CreateSafeAction(SupNews_Update_Schema, handler)
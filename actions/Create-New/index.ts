"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { News_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {title , content , date} = data;

    let news_data;

    try {
        news_data = await db.news.create({
            data:{
                title : title,
                content : content,
                date: date
            }
        });
        revalidatePath('/admin/newsLists')
    } catch (error) {
        console.log(error)
    }
    console.log("-- News_Data -- : " , news_data , " -- End -- ")
    return redirect('/admin/newsLists');
}

export const createNews_action = CreateSafeAction(News_Create_Schema, handler)
"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupNews_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {title , content , date , supadminid} = data;

    let news_data;

    try {
        news_data = await db.news.create({
            data:{
                title : title,
                content : content,
                date: date
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- News_Data -- : " , news_data , " -- End -- ")
    return redirect(`/supadmin/${supadminid}/newsLists`);
}

export const SupcreateNews_action = CreateSafeAction(SupNews_Create_Schema, handler)
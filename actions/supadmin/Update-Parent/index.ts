"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupParent_Update_Schema } from "./schema";



const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        userid,
        username,
        nickname,
        email,
        phone,
        } = data;

    // let Parent_data;
    let user_data;

    try {
        user_data = await db.user.update({
            where:{
                id :userid
            },
            data:{
                username : username,
                nickname : nickname,
                email : email,
                phone : phone,
                parent_message_id: "",
                parent_price_record_id: ""
            }
        })


    } catch (error) {
        console.log(error)
    }

    console.log("-- Update_Parent_Data -- : " , user_data , " -- End -- ")
    return { data: user_data }
}

export const SupupdateParent = CreateSafeAction(SupParent_Update_Schema, handler)
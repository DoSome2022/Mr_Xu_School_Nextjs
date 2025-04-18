"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Parent_Data_Create_Schema } from "./schema";
import { UserRole } from "@prisma/client";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        parent_user_id,
        parent_message_id,
        parent_price_record_id,
        done
        } = data;


    let Parent_data;

    try {
        Parent_data = await db.parent_data.create({
            data:{
                parent_user_id: parent_user_id,
                parent_message_id: parent_message_id,
                parent_price_record_id: parent_price_record_id,
                done: done
            }
        })


    } catch (error) {
        console.log(error)
    }

    console.log("-- Parent_Data -- : " , Parent_data , " -- End -- ")
    return { data: Parent_data }
}

export const create_Parent_Data = CreateSafeAction(Parent_Data_Create_Schema, handler)
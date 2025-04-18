"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Message_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        message_content , receiver , sender
        } = data;

    let message_data;

    try {
        message_data = await db.message.create({
            data:{
                message_content : message_content,
                receiver : receiver,
                sender :sender
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- message_Data -- : " , message_data , " -- End -- ")
    return { data: message_data }
}

export const createMessage = CreateSafeAction(Message_Create_Schema, handler)
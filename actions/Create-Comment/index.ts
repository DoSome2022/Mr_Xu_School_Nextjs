"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Comment_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            content , 
            author , 
            student_id
        } = data;

    let Comment_data;

    try {
        Comment_data = await db.comment.create({
            data:{
                content : content,
                author : author,
                student_id : student_id
            }
        });
        revalidatePath("")
    } catch (error) {
        console.log(error)
    }
    console.log("-- Comment_Data -- : " , Comment_data , " -- End -- ")
    return { data: Comment_data }
}

export const createComment = CreateSafeAction(Comment_Create_Schema, handler)
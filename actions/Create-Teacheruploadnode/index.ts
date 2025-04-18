"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Teacher_upload_node_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        name,
        title,
        subject,
        answer,
        img,
        author,
        lesson,
        grade,
        language,
        teacher
        } = data;

    let teacher_upload_node_data;

    try {
        teacher_upload_node_data = await db.teacher_upload_node.create({
            data:{
                name : name,
                title : title,
                subject : subject,
                answer : answer,
                img : img,
                author : author,
                lesson : lesson,
                grade : grade,
                language : language,
                teacher : teacher
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- teacher_upload_node_Data -- : " , teacher_upload_node_data , " -- End -- ")
    return { data: teacher_upload_node_data }
}

export const createTeacherUploadNode = CreateSafeAction(Teacher_upload_node_Create_Schema, handler)
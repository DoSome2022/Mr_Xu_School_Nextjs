"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Teacher_Data_Create_Schema } from "./schema"; 


const handler = async( data:InputType ) : Promise<ReturnType> => {
    const {
        subject,
        cram,
        teacher_time_work_id,
        teacher_node_id,
        teacher_user_id,
        teacher_upload_node_id
    } = data;

    console.log("-- teacher_Data  create  db before  -- : " , data , " -- End -- ")

    let Teacher_Data;

    try {
        Teacher_Data = await db.teacher_data.create({
            data:{
               subject: subject,
               cram: cram,
               teacher_time_work_id: teacher_time_work_id,
               teacher_node_id : teacher_node_id,
               teacher_user_id : teacher_user_id ,
               teacher_upload_node_id : teacher_upload_node_id,
            }
        })
    } catch (error) {
        console.log(error)
    }
    console.log("-- teacher_Data -- : " , Teacher_Data , " -- End -- ")
    return { data: Teacher_Data }

}

export const create_Teacher_Data = CreateSafeAction(Teacher_Data_Create_Schema, handler)
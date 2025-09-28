"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { student_parent_create_Schema } from "./schema";
import { redirect } from 'next/navigation'
import { revalidatePath } from "next/cache";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {

    const { name , school , grade , id } = data;

    let student_data_parent;

    try {
        student_data_parent = await db.student.create({
            data:{
                name : name,
                school : school,
                grade : grade,
                chine_ex:"",
                math_ex:"",
                eng_ex:"",
                student_id : "",
                student_parent_data_id : id,
                teachers : "",
                pay : false ,
                ismember:false,
                issurvive:true

            }
        });
        revalidatePath(`/parent/${id}/`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_data_parent -- : " , student_data_parent , " -- End -- ")

    return redirect(`/parent/${id}/`)
}

export const createStudentParentData = CreateSafeAction(student_parent_create_Schema, handler);
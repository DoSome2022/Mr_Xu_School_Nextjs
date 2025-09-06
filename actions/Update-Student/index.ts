"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Student_Update_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
    
   
    const {
        name,
        school,
        grade,
        final_day,
        student_class_id,
        student_id,
        student_parent_data_id,
        student_teacher_data_id,
        teachers,
        pay = false 
        } = data;

        console.log("-- Student_Data -- : " , data , " -- End -- ")

    let Student_data;

    try {
        Student_data = await db.student.create({
            data:{
                name : name,
                school : school,
                grade : grade,
                student_id : student_id,
                student_parent_data_id : student_parent_data_id,
                teachers : teachers,
                pay : pay ,
                ismember: false,
                issurvive : false
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- Student_Data -- : " , Student_data , " -- End -- ")
     return { data: Student_data }
}

export const Update_Student = CreateSafeAction(Student_Update_Schema, handler)
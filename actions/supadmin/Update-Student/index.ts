"use server";


import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupStudent_Update_Schema } from "./schema";


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

export const SupUpdate_Student = CreateSafeAction(SupStudent_Update_Schema, handler)
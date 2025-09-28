"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupStudent_Create_Schema } from "./schema";
import { redirect } from 'next/navigation'

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
    
   
    const {
        name,
        school,
        grade,
        // final_day,
        chine_ex_day,
        math_ex_day,
        eng_ex_day,
        student_class_id,
        student_id,
        student_parent_data_id,
        student_teacher_data_id,
        teachers,
        pay = false ,
        supadminId
        } = data;

        console.log("-- Student_Data -- : " , data , " -- End -- ")

    let Student_data;

    try {
        Student_data = await db.student.create({
            data:{
                name : name,
                school : school,
                grade : grade,
                chine_ex_day : chine_ex_day,
                math_ex_day : math_ex_day,
                eng_ex_day : eng_ex_day,
                ismember:  false,
                issurvive: true,
                chine_ex:"",
                math_ex:"",
                eng_ex:"",
                student_id : student_id,
                student_parent_data_id : student_parent_data_id,
                teachers : teachers,
                pay : pay 
            }
        });
        revalidatePath(`/supadmin/${supadminId}/userLists/parentsLists/${student_parent_data_id}`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- Student_Data -- : " , Student_data , " -- End -- ")
     return redirect(`/supadmin/${supadminId}/userLists/parentsLists/${student_parent_data_id}`)
}

export const Supcreate_Student = CreateSafeAction(SupStudent_Create_Schema, handler)
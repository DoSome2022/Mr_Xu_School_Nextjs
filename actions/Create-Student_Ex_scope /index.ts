"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { student_ex_scope_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            student_ex_scope_id,
            student_name,
            grade,
            quarter,
            school,
            subject,
        } = data;

    let student_ex_scope_Data;

    try {
        student_ex_scope_Data = await db.student_ex_scope.create({
            data:{
                name : name,
                img : img,
                student_ex_scope_id : student_ex_scope_id,
                student_name : student_name,
                grade : grade,
                quarter : quarter,
                school : school,
                subject : subject
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_ex_scope_Data -- : " , student_ex_scope_Data , " -- End -- ")
    return { data: student_ex_scope_Data }
}

export const createStudentExScope = CreateSafeAction(student_ex_scope_Create_Schema, handler)
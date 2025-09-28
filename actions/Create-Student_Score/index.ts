"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { student_score_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        student_name,
        student_score_id,
        subject,
        grade,
        score,
        quarter,
        school,
        year,
        name,
        img,
        parentId,
        } = data;

    let student_score_Data;

    try {
        student_score_Data = await db.student_score.create({
            data:{
                student_name : student_name,
                student_score_id : student_score_id,
                subject : subject,
                grade : grade,
                score : score,
                quarter : quarter,
                year: year,
                school: school,
                name: name,
                img:img,
            }
        });
        revalidatePath(`/admin/userLists/parentsLists/${parentId}/studentLists/${student_score_id}/scoreLists/`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_score_Data -- : " , student_score_Data , " -- End -- ")
    return redirect (`/admin/userLists/parentsLists/${parentId}/studentLists/${student_score_id}/scoreLists/`)
}

export const createStudentScore = CreateSafeAction(student_score_Create_Schema, handler)
"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_ex_timetable_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            student_ex_timetable_id,
            student_name,
            grade,
            year,
            quarter,
            school,
            subject,
            parentId
        } = data;

    let student_ex_timetable_Data;

    try {
        student_ex_timetable_Data = await db.student_ex_timetable.create({
            data:{
                name : name,
                img : img,
                student_ex_timetable_id : student_ex_timetable_id,
                student_name : student_name,
                grade : grade,
                year : year,
                quarter : quarter,
                school: school,
                subject: subject
            }
        });
        revalidatePath(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_ex_timetable_id}/extimeLists`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_ex_timetable_Data -- : " , student_ex_timetable_Data , " -- End -- ")
    return redirect(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_ex_timetable_id}/extimeLists`)
}

export const SupcreateStudentExTimeTable = CreateSafeAction(Supstudent_ex_timetable_Create_Schema, handler)
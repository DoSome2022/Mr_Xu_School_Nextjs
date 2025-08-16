"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_school_timetable_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            student_school_timetable_id,
            student_name,
            grade,
            year,
            quarter,
            school,
            parentId,
        } = data;

    let student_school_timetable_Data;

    try {
        student_school_timetable_Data = await db.student_school_timetable.create({
            data:{
                name : name,
                img : img,
                student_school_timetable_id : student_school_timetable_id,
                student_name : student_name,
                grade : grade,
                year : year,
                quarter : quarter,
                school : school,
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_school_timetable_Data -- : " , student_school_timetable_Data , " -- End -- ")
    return redirect(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${student_school_timetable_id}/schooltimetableLists/`)
}

export const SupcreateStudentSchoolTimetable = CreateSafeAction(Supstudent_school_timetable_Create_Schema, handler)
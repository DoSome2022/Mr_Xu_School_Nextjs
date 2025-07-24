"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { School_timetable_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            school_school_timetable_id,
            school_name,
            grade,
            year,
            quarter,
        } = data;

    let school_timetable_Data;

    try {
        school_timetable_Data = await db.school_timetable.create({
            data:{
                name : name,
                img : img,
                school_school_timetable_id : school_school_timetable_id,
                school_name : school_name,
                grade : grade,
                year : year,
                quarter : quarter,
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- school_timetable_Data -- : " , school_timetable_Data , " -- End -- ")
    // return { data: school_timetable_Data }
    return redirect(`/admin/schoolLists/${school_school_timetable_id}/extimeLists`)
}

export const createSchoolTimeTable = CreateSafeAction(School_timetable_Create_Schema, handler)
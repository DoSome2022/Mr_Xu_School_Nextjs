"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Ex_timetable_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            school_ex_time_id,
            school_name,
            grade,
            year,
            quarter,
            subject,
        } = data;

    let ex_timetable_Data;

    try {
        ex_timetable_Data = await db.ex_timetable.create({
            data:{
                name : name,
                img : img,
                school_ex_time_id : school_ex_time_id,
                school_name : school_name,
                grade : grade,
                year : year,
                quarter : quarter,
                subject: subject
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- ex_timetable_Data -- : " , ex_timetable_Data , " -- End -- ")
    return { data: ex_timetable_Data }
}

export const createExTimeTable = CreateSafeAction(Ex_timetable_Create_Schema, handler)
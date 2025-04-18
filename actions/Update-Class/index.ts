"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Class_Update_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        freq,
        byweekday,
        class_course_id , 
        allDay,
        attend_number ,
        class_time_h ,
        cram , 
        classroom , 
        persons , 
        class_lesson , 
        class_date , 
        class_start_time,
        class_end_time,
        teacher , 
        node,
        grade,
        title,
        classId,
        } = data;

    let class_data;

    try {
        class_data = await db.class.update({
            where:{
                id: classId
            },
            data:{
                class_time_h: class_time_h,
                cram: cram,
                classroom: classroom,
                persons: persons,
                class_course_id: class_course_id,
                class_lesson: class_lesson,
                class_date: class_date,
                class_start_time: class_start_time,
                class_end_time: class_end_time,
                attend_number: attend_number,
                teacher: teacher,
                node: node,
                grade:grade,
                freq:freq,
                byweekday:byweekday,
                title:title,
                allDay:allDay,
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- Class_Data_update -- : " , class_data , " -- End -- ")
    return redirect(`/admin/courseLists/${class_course_id}/classLists/${classId}`)

}

export const updateClass = CreateSafeAction(Class_Update_Schema, handler)
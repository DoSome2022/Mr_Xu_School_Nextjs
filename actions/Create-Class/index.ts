"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Class_Create_Schema } from "./schema";
import { redirect } from 'next/navigation'


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        freq,
        byweekday,
        class_course_id,
        allDay,
        attend_number,
        class_time_h,
        cram,
        classroom,
        persons,
        class_lesson,
        class_date,
        class_start_time,
        class_end_time,
        teacher,
        node,
        grade,
        title,
        } = data;

    let class_data;

    try {
        for (const date of class_date) {
        let class_data = await db.class.create({
            data: {
                class_time_h:class_time_h,
                cram: cram,
                classroom: classroom,
                persons: persons,
                class_course_id: class_course_id,
                class_lesson: class_lesson,
                class_date: [new Date(date)],
                class_start_time: class_start_time,
                class_end_time: class_end_time,
                attend_number: attend_number,
                teacher: teacher,
                node: node,
                grade: grade,
                freq: freq,
                byweekday: byweekday,
                title: title,
                allDay: allDay,
            },  
        }   
    );
        

        await db.course.update({
            where:{id : class_course_id},
            data:{
                class:{
                    connect: {id: class_data.id}
                }
            }
        })
}

    } catch (error) {
        console.log(error)
    }
    console.log("-- Class_Data -- : " , class_data , " -- End -- ")
     return redirect(`/admin/courseLists/${class_course_id}`)
}

export const createClass = CreateSafeAction(Class_Create_Schema, handler)


"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Course_Update_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {courseId, course_name , course_subject , course_level , persons , grade , teacher , course_teacher_data_id} = data;

    let course_data;

    try {
        course_data = await db.course.update({
            where:{
                id: courseId
            },
            data:{
                course_name : course_name,
                course_subject : course_subject,
                course_level : course_level,
                persons : persons,
                grade: grade ,
                teacher: teacher,
                course_teacher_data_id : course_teacher_data_id
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- Course_Update_Data -- : " , course_data , " -- End -- ")
    return redirect(`/admin/courseLists/${courseId}`)
}

export const update_Course = CreateSafeAction(Course_Update_Schema, handler)
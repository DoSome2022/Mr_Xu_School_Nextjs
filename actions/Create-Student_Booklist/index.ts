"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { student_booklist_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        name,
        img,
        student_booklist_id,
        student_name,
        grade,
        year,
        school,
        } = data;

    let student_booklist_Data;

    try {
        student_booklist_Data = await db.student_booklist.create({
            data:{
                name : name,
                img : img,
                student_booklist_id : student_booklist_id,
                student_name : student_name,
                grade : grade,
                year : year,
                school : school,
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_booklist_Data -- : " , student_booklist_Data , " -- End -- ")
    return { data: student_booklist_Data }
}

export const createStudentBookList = CreateSafeAction(student_booklist_Create_Schema, handler)
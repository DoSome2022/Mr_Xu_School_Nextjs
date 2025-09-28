"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { student_booklist_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        studentId,
        parentId,
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
        revalidatePath(`/admin/userLists/parentsLists/${parentId}/studentLists/${studentId}/bookLists`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_booklist_Data -- : " , student_booklist_Data , " -- End -- ")
    return redirect(`/admin/userLists/parentsLists/${parentId}/studentLists/${studentId}/bookLists`)
}

export const createStudentBookList = CreateSafeAction(student_booklist_Create_Schema, handler)
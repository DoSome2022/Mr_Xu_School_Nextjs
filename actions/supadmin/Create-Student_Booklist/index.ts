"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_booklist_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

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
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_booklist_Data -- : " , student_booklist_Data , " -- End -- ")
    return redirect(`/supadmin/userLists/parentsLists/${parentId}/studentLists/${studentId}/bookLists`)
}

export const SupcreateStudentBookList = CreateSafeAction(Supstudent_booklist_Create_Schema, handler)
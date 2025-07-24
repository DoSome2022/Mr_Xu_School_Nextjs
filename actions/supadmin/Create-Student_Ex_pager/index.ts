"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Supstudent_ex_paper_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            student_ex_paper_id,
            student_name,
            subject,
            grade,
            year,
            quarter,
            school,
            parentId,
        } = data;

    let student_ex_paper_Data;

    try {
        student_ex_paper_Data = await db.student_ex_paper.create({
            data:{
                name : name,
                img : img,
                student_ex_paper_id : student_ex_paper_id,
                student_name : student_name,
                subject : subject,
                grade : grade,
                year : year,
                quarter : quarter,
                school : school
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- student_ex_paper_Data -- : " , student_ex_paper_Data , " -- End -- ")
    return redirect(`/admin/userLists/parentsLists/${parentId}/studentLists/${student_ex_paper_id}/expageLists/`)
}

export const SupcreateStudentExPaper = CreateSafeAction(Supstudent_ex_paper_Create_Schema, handler)
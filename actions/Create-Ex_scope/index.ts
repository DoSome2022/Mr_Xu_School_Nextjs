"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Ex_scope_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            name,
            img,
            school_ex_scope_id,
            school_name,
            grade,
            quarter,
            subject,
        } = data;

    let ex_scope_Data;

    try {
        ex_scope_Data = await db.ex_scope.create({
            data:{
                name : name,
                img : img,
                school_ex_scope_id : school_ex_scope_id,
                school_name : school_name,
                grade : grade,
                quarter : quarter,
                subject : subject
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- ex_scope_Data -- : " , ex_scope_Data , " -- End -- ")
    return { data: ex_scope_Data }
}

export const createExScope = CreateSafeAction(Ex_scope_Create_Schema, handler)
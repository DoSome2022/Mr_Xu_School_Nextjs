"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupEx_pager_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        supadminid,
            name,
            img,
            school_ex_pager_id,
            school_name,
            subject,
            grade,
            year,
            quarter,
        } = data;

    let ex_pager_Data;

    try {
        ex_pager_Data = await db.ex_pager.create({
            data:{
                name : name,
                img : img,
                school_ex_pager_id : school_ex_pager_id,
                school_name : school_name,
                subject : subject,
                grade : grade,
                year : year,
                quarter : quarter,
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- ex_pager_Data -- : " , ex_pager_Data , " -- End -- ")
    return redirect(`/admin/${supadminid}/schoolLists/${school_ex_pager_id}/expageLists/`)
}
export const SupcreateExPager = CreateSafeAction(SupEx_pager_Create_Schema, handler)
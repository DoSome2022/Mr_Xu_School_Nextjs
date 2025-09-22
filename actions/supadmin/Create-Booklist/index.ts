"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { SupBooklist_Create_Schema } from "./schema";
import { redirect } from "next/navigation";






const handler = async ( data: InputType ) : Promise<ReturnType> =>  {

let booklist_Data;
   
    const {
        supadminid,
        name,
        img,
        school_booklist_id,
        school_name,
        grade,
        year
        } = data;

    try {

        booklist_Data = await db.booklist.create({
            data:{
                name : name,
                img : img,
                school_booklist_id : school_booklist_id,
                school_name : school_name,
                grade : grade,
                year : year,
            }
        });
        
    } catch (error) {
        console.log(error)
    }

    
    console.log("-- booklist_Data -- : " , booklist_Data , " -- End -- ")
    return redirect(`/supadmin/${supadminid}/schoolLists/${school_booklist_id}/bookLists/`)
}

export const SupcreateBooklist = CreateSafeAction(SupBooklist_Create_Schema, handler)
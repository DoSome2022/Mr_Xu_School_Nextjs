"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { School_Create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            school_name
        } = data;

    let school_data;

    try {
        school_data = await db.school.create({
            data:{
                school_name : school_name
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- school_Data -- : " , school_data , " -- End -- ")
    return redirect(`/admin/schoolLists`);
}

export const createSchool_action= CreateSafeAction(School_Create_Schema, handler)
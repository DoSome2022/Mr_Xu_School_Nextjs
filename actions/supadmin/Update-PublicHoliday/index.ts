"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Suppublic_holiday_edit_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        supadminid,
        id,
        publicholiday,

        } = data;

    let public_holiday;

    try {
        public_holiday= await db.public_holiday.update({
            where:{
                id:id,
            },
            data:{
                publicholiday:publicholiday,
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- public_holiday -- : " , public_holiday , " -- End -- ")
    return redirect(`/supadmin/${supadminid}/setpublicholidaysLists`)
}

export const SupeditPublic_holiday = CreateSafeAction(Suppublic_holiday_edit_Schema, handler)
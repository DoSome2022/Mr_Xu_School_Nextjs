"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Suppublic_holiday_create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        supadminid,
        publicholiday,

        } = data;

    let public_holiday;

    try {
        public_holiday= await db.public_holiday.create({
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

export const SupcreatePublic_holiday = CreateSafeAction(Suppublic_holiday_create_Schema, handler)
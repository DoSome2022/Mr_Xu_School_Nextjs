"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { public_holiday_create_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {

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
    return redirect(`/admin/setpublicholidaysLists`)
}

export const createPublic_holiday = CreateSafeAction(public_holiday_create_Schema, handler)
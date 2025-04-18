"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Price_Record_Create_Schema } from "./schema";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
            price,
            parent_name
        } = data;

    let price_record_data;

    try {
        price_record_data = await db.price_record.create({
            data:{
                price: price,
                parent_name: parent_name
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- price_record_Data -- : " , price_record_data , " -- End -- ")
    return { data: price_record_data }
}

export const createPrice_Record = CreateSafeAction(Price_Record_Create_Schema, handler)
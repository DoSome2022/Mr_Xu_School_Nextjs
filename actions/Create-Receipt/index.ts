"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Receipt_Create_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {

        title,
        content,
        price,
        DB,
        adminFee,
        studentname,
        

        } = data;

    let receipt_data;

    try {
        receipt_data= await db.receipt.create({
            data:{

                title:title,
                content:content,
                price:price,
                DB:DB,
                adminFee:adminFee,
                studentname

            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- invoice_data -- : " , receipt_data , " -- End -- ")
    return redirect(`/admin/`)
}

export const createReceipt = CreateSafeAction(Receipt_Create_Schema, handler)
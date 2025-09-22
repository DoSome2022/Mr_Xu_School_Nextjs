"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Apply_Accept_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        
        applyId
        } = data;

    let apply_data;

    try {
        apply_data = await db.apply.update({
            where:{
                id: applyId
            },data:{
                apply:true,
                isapply:true
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- apply_data -- : " , apply_data , " -- End -- ")
    return redirect(`/admin/applyLists/`)
}

export const AcceptApplyClass = CreateSafeAction(Apply_Accept_Schema, handler)
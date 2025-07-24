"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Sup_Apply_Reject_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
        supadminId,
        applyId
        } = data;

    let apply_data;

    try {
        apply_data = await db.apply.update({
            where:{
                id: applyId
            },data:{
                apply:false,
                isapply:true
            }
        });
    } catch (error) {
        console.log(error)
    }
    console.log("-- apply_data -- : " , apply_data , " -- End -- ")
    return redirect(`/admin/${supadminId}/applyLists/`)
}

export const SupRejectApplyClass = CreateSafeAction(Sup_Apply_Reject_Schema, handler)
"use server";

import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Sup_Apply_Accept_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";


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
                apply:true,
                isapply:true
            }
        });
        revalidatePath(`/supadmin/${supadminId}/applyLists/`)
    } catch (error) {
        console.log(error)
    }
    console.log("-- apply_data -- : " , apply_data , " -- End -- ")
    return redirect(`/supadmin/${supadminId}/applyLists/`)
}

export const SupAcceptApplyClass = CreateSafeAction(Sup_Apply_Accept_Schema, handler)
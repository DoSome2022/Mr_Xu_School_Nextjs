"use server";

import { auth } from "@/auth";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { DeleteApply } from "./schema";
import { redirect } from "next/navigation";


const handler = async (data: InputType) : Promise<ReturnType> => {
    

    const { id } = data;
    let apply;

    try {
        apply = await db.apply.delete({
            where:{id}
        })
    revalidatePath(``)
    // redirect('/admin/ReceiptLists')
    } catch (error) {
        console.log(error)
        return {
            error: "不能刪除"
        }
    }
    return {
        data: apply
    }

}


export const deleteApply = CreateSafeAction(DeleteApply , handler)
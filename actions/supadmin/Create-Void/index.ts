"use server";

import { db } from "@/lib/db";
import { InputType , ReturnType } from "./types"; 
import { CreateSafeAction } from "@/lib/create-safe-action";
import { redirect } from 'next/navigation'
import { SupVoidCreateSchema } from "./schema";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> =>  {

    const {title , price} = data;

    let void_data;

    try {
        void_data = await db.voidRecord.create({
            data: {
                title: title,
                price: price,
            }
        })
        revalidatePath('/admin/ReceiptLists')
    } catch (error) {
        console.log(error)
    }
    console.log("-- void_data -- : " , void_data , " -- End -- ")
    return redirect('/admin/ReceiptLists')
}
export const SupCreateVoid_action = CreateSafeAction(SupVoidCreateSchema, handler)
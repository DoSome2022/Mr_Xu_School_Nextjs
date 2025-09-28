"use server";

import { revalidatePath } from "next/cache"; 
import { InputType , ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { public_holiday_edit_Schema } from "./schema";
import { redirect } from "next/navigation";


const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
    const {
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
        revalidatePath('/admin/setpublicholidaysLists');  // 無效化客戶端頁面路徑的快取
        revalidatePath('/api/PublicHoliday_Lists');  // 無效化 API 路由快取（雖然已動態化，但作為備援）
    } catch (error) {
        console.log(error)
    }
    console.log("-- public_holiday -- : " , public_holiday , " -- End -- ")
    return redirect(`/admin/setpublicholidaysLists`)
}

export const editPublic_holiday = CreateSafeAction(public_holiday_edit_Schema, handler)
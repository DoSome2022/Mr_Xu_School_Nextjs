// "use server";

// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { public_holiday_create_Schema } from "./schema";
// import { redirect } from "next/navigation";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {

//         publicholiday,

//         } = data;

//     let public_holiday;

//     try {
//         public_holiday= await db.public_holiday.create({
//             data:{

//                 publicholiday:publicholiday,

//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- public_holiday -- : " , public_holiday , " -- End -- ")
//     return redirect(`/admin/setpublicholidaysLists`)
// }

// export const createPublic_holiday = CreateSafeAction(public_holiday_create_Schema, handler)

// 您的伺服器動作檔案

"use server";

import { InputType, ReturnType } from "./types"; 
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { public_holiday_create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";  // 匯入 revalidatePath

const handler = async (data: InputType): Promise<ReturnType> => {
    const { publicholiday } = data;
    let public_holiday;

    try {
        public_holiday = await db.public_holiday.create({
            data: { publicholiday },
        });
        revalidatePath('/admin/setpublicholidaysLists');  // 無效化客戶端頁面路徑的快取
        revalidatePath('/api/PublicHoliday_Lists');  // 無效化 API 路由快取（雖然已動態化，但作為備援）
    } catch (error) {
        console.log(error);
        return { error: '建立失敗' };  // 添加錯誤返回（依您的類型調整）
    }

    console.log("-- public_holiday -- : ", public_holiday, " -- End -- ");
    return redirect(`/admin/setpublicholidaysLists`);
};

export const createPublic_holiday = CreateSafeAction(public_holiday_create_Schema, handler);
// "use server";

// import { revalidatePath } from "next/cache"; 
// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Price_Record_Create_Schema } from "./schema";


// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {
//             price,
//             parent_name
//         } = data;

//     let price_record_data;

//     try {
//         price_record_data = await db.price_record.create({
//             data:{
//                 price: price,
//                 parent_name: parent_name
//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- price_record_Data -- : " , price_record_data , " -- End -- ")
//     return { data: price_record_data }
// }

// export const createPrice_Record = CreateSafeAction(Price_Record_Create_Schema, handler)


"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Price_Record_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { Price_record } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { price, parent_name, productId } = data;

  let price_record_data: Price_record | undefined;

  try {
    // 驗證 parent_name 是否有效（假設與 Parent 模型關聯）
    const parent = await db.user.findFirst({ where: { username: parent_name } });
    if (!parent) {
      return { error: "指定的家長不存在" };
    }

    // 驗證 productId 是否有效
    const product = await db.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { error: "指定的產品不存在" };
    }

    price_record_data = await db.price_record.create({
      data: {
        price,
        parent_name,
        product: { connect: { id: productId } }, // 使用嵌套關聯
        Parent_data: { connect: { id: parent.id } },
      },
    });

    // 重新驗證相關頁面（假設為價格記錄列表）
    revalidatePath("/admin/priceRecords");

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- price_record_Data -- : ", price_record_data, " -- End -- ");
    }

    // 重定向到價格記錄列表（可根據需求調整路徑）
    redirect("/admin/priceRecords");

    return { data: price_record_data };
  } catch (error) {
    console.error("創建價格記錄失敗:", error);
    return { error: "無法創建價格記錄，請檢查輸入數據" };
  }
};

export const createPrice_Record = CreateSafeAction(Price_Record_Create_Schema, handler);
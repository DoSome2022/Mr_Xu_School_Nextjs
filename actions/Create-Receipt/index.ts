// "use server";

// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { Receipt_Create_Schema } from "./schema";
// import { redirect } from "next/navigation";

// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
   
//     const {

//         title,
//         content,
//         price,
//         DB,
//         adminFee,
//         studentname,
        

//         } = data;

//     let receipt_data;

//     try {
//         receipt_data= await db.receipt.create({
//             data:{

//                 title:title,
//                 content:content,
//                 price:price,
//                 DB:DB,
//                 adminFee:adminFee,
//                 studentname

//             }
//         });
//     } catch (error) {
//         console.log(error)
//     }
//     console.log("-- invoice_data -- : " , receipt_data , " -- End -- ")
//     return redirect(`/admin/`)
// }

// export const createReceipt = CreateSafeAction(Receipt_Create_Schema, handler)


"use server";

import { revalidatePath } from "next/cache";
import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { Receipt_Create_Schema } from "./schema";
import { redirect } from "next/navigation";
import { Receipt } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const {
    title,
    content,
    price,
    DB,
    adminFee,
    studentname,
    invoicebydbid,
    Invoice_id,
    servetype,
    isPayment,
    parentId,
  } = data;

  let receipt_data: Receipt | undefined;

  try {
    // 驗證 studentname 是否有效（假設與 Student 模型關聯）
    const student = await db.student.findFirst({ where: { name: studentname } });
    if (!student) {
      return { error: "指定的學生不存在" };
    }

    receipt_data = await db.receipt.create({
      data: {
        title,
        content,
        price,
        DB,
        adminFee,
        studentname,
        invoicebydbid,
        Invoice_id,
        servetype,
        isPayment,
        parentId
      },
    });

    // 重新驗證相關頁面（假設為發票列表）
    revalidatePath("/admin/receipts");

    // 記錄成功創建（僅用於開發環境）
    if (process.env.NODE_ENV === "development") {
      console.log("-- receipt_data -- : ", receipt_data, " -- End -- ");
    }

    // 重定向到發票列表（可根據需求調整路徑）
    redirect("/admin/receipts");

    return { data: receipt_data };
  } catch (error) {
    console.error("創建發票記錄失敗:", error);
    return { error: "無法創建發票記錄，請檢查輸入數據" };
  }
};

export const createReceipt = CreateSafeAction(Receipt_Create_Schema, handler);
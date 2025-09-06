// "use server";

// import { InputType , ReturnType } from "./types"; 
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { IsPay_Change_Schema } from "./schema";
// import { redirect } from "next/navigation";

// const handler = async ( data: InputType ) : Promise<ReturnType> =>  {
    
//     const {invoiceId , IsPay} = data;
//     let invoice_change;
//     let receipt_data;
//     let invoice_data ; 
//     try {
//         invoice_change = await db.invoice.update({
//             where:{
//                 id:invoiceId
//             },
//             data:{
//                 isPayment:IsPay
//             }
//         })

//         invoice_data = await db.invoice.findUnique({
//             where:{
//                 id:invoiceId
//             }
//         })
        
//         receipt_data = await db.receipt.create({
//             data:{
//                 title:invoice_data?.title,
//                 content:invoice_data?.content,
//                 price:invoice_data?.price,
//                 invoicebydbid:invoiceId,
//                 servetype:invoice_data?.servetype,
//                 isPayment:IsPay,
//                 studentname:invoice_data?.studentname,
//                 Invoice_id:invoice_data?.Invoice_id,
//                 PaymentMethods:invoice_data?.PaymentMethods,
//                 DB:invoice_data?.DB,
//                 adminFee:invoice_data?.adminFee,
//             }
//         })


//     }  catch (error) {
//         console.log(error)
//     }

//     console.log("-- invoice_change -- : " , invoice_change , " -- End -- ")
//     console.log("-- receipt_data -- : " , receipt_data , " -- End -- ")
//     return redirect(`/admin/InvoiceLists/`)
// }

// export const IsPay_Change_Action = CreateSafeAction(IsPay_Change_Schema, handler);



"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { IsPay_Change_Schema } from "./schema";
import { redirect } from "next/navigation";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { invoiceId, IsPay } = data;
  let invoice_change;
  let receipt_data;

  try {
    // 更新 Invoice 的 isPayment 狀態
    invoice_change = await db.invoice.update({
      where: { id: invoiceId },
      data: { isPayment: IsPay },
    });

    // 查詢 Invoice 資料
    const invoice_data = await db.invoice.findUnique({
      where: { id: invoiceId },
    });

    // 檢查 invoice_data 是否存在
    if (!invoice_data) {
      return {
        error: "找不到指定的發票記錄",
      };
    }

    // 創建 Receipt 記錄
    receipt_data = await db.receipt.create({
      data: {
        title: invoice_data.title, // 直接訪問，無需 ?. 因為已確認 invoice_data 存在
        content: invoice_data.content, // content 是 String[]，應安全
        price: invoice_data.price, // price 是 Float，應安全
        invoicebydbid: invoiceId,
        servetype: invoice_data.servetype, // servetype 是 String，應安全
        isPayment: IsPay,
        studentname: invoice_data.studentname, // studentname 是 String，應安全
        Invoice_id: invoice_data.Invoice_id, // Invoice_id 是 String，應安全
        PaymentMethods: invoice_data.PaymentMethods, // PaymentMethods 是 String[]，應安全
        DB: invoice_data.DB, // DB 是 Float，應安全
        adminFee: invoice_data.adminFee, // adminFee 是 Float，應安全
      },
    });

    // 記錄成功操作（僅用於調試，可根據需要移除）
    console.log("-- invoice_change -- : ", invoice_change, " -- End -- ");
    console.log("-- receipt_data -- : ", receipt_data, " -- End -- ");

    // 重定向到發票列表頁面
    return redirect(`/admin/InvoiceLists/`);
  } catch (error) {
    console.error("更新發票或創建收據時發生錯誤:", error);
    return {
      error: "操作失敗，請稍後重試",
    };
  }
};

export const IsPay_Change_Action = CreateSafeAction(IsPay_Change_Schema, handler);
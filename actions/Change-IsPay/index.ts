"use server";

import { InputType, ReturnType } from "./types";
import { db } from "@/lib/db";
import { CreateSafeAction } from "@/lib/create-safe-action";
import { IsPay_Change_Schema } from "./schema";

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

    // 使用 student_id 查詢 Student 以取得 parentId
    const student_data = await db.student.findUnique({
      where: { id: invoice_data.student_id },
      select: { student_parent_data_id: true }, // 只選取需要的欄位以優化查詢
    });

    // 檢查 student_data 是否存在且有 parentId
    if (!student_data || !student_data.student_parent_data_id) {
      return {
        error: "找不到對應的學生記錄或家長 ID",
      };
    }

    const parentId = student_data.student_parent_data_id;

    // 創建 Receipt 記錄，並注入 parentId
    receipt_data = await db.receipt.create({
      data: {
        title: invoice_data.title,
        content: invoice_data.content,
        price: invoice_data.price,
        invoicebydbid: invoiceId,
        servetype: invoice_data.servetype,
        isPayment: IsPay,
        studentname: invoice_data.studentname,
        Invoice_id: invoice_data.Invoice_id,
        PaymentMethods: invoice_data.PaymentMethods,
        DB: invoice_data.DB,
        adminFee: invoice_data.adminFee,
        parentId: parentId, // 注入取得的 parentId
      },
    });

    // 記錄成功操作（僅用於調試，可根據需要移除）
    console.log("-- invoice_change -- : ", invoice_change, " -- End -- ");
    console.log("-- receipt_data -- : ", receipt_data, " -- End -- ");

    return {
      success: "付款狀態更新成功",
      data: receipt_data,
    };
  } catch (error) {
    console.error("更新發票或創建收據時發生錯誤:", error);
    return {
      error: "操作失敗，請稍後重試",
    };
  }
};

export const IsPay_Change_Action = CreateSafeAction(IsPay_Change_Schema, handler);


// "use server";

// import { InputType, ReturnType } from "./types";
// import { db } from "@/lib/db";
// import { CreateSafeAction } from "@/lib/create-safe-action";
// import { IsPay_Change_Schema } from "./schema";


// const handler = async (data: InputType): Promise<ReturnType> => {
//   const { invoiceId, IsPay } = data;
//   let invoice_change;
//   let receipt_data;

//   try {
//     // 更新 Invoice 的 isPayment 狀態
//     invoice_change = await db.invoice.update({
//       where: { id: invoiceId },
//       data: { isPayment: IsPay },
//     });

//     // 查詢 Invoice 資料
//     const invoice_data = await db.invoice.findUnique({
//       where: { id: invoiceId },
//     });

//     // 檢查 invoice_data 是否存在
//     if (!invoice_data) {
//       return {
//         error: "找不到指定的發票記錄",
//       };
//     }

//     // 使用 student_id 查詢 Student 以取得 parentId
//     const student_data = await db.student.findUnique({
//       where: { id: invoice_data.student_id },
//       select: { student_parent_data_id: true }, // 只選取需要的欄位以優化查詢
//     });

//     // 檢查 student_data 是否存在且有 parentId
//     if (!student_data || !student_data.student_parent_data_id) {
//       return {
//         error: "找不到對應的學生記錄或家長 ID",
//       };
//     }

//     const parentId = student_data.student_parent_data_id;

//     // 創建 Receipt 記錄，並注入 parentId
//     receipt_data = await db.receipt.create({
//       data: {
//         title: invoice_data.title,
//         content: invoice_data.content,
//         price: invoice_data.price,
//         invoicebydbid: invoiceId,
//         servetype: invoice_data.servetype,
//         isPayment: IsPay,
//         studentname: invoice_data.studentname,
//         Invoice_id: invoice_data.Invoice_id,
//         PaymentMethods: invoice_data.PaymentMethods,
//         DB: invoice_data.DB,
//         adminFee: invoice_data.adminFee,
//         parentId: parentId, // 注入取得的 parentId
//       },
//     });

//     // 記錄成功操作（僅用於調試，可根據需要移除）
//     console.log("-- invoice_change -- : ", invoice_change, " -- End -- ");
//     console.log("-- receipt_data -- : ", receipt_data, " -- End -- ");

//     // 重定向到發票列表頁面（此部分將在下節移至 client-side）
//     return {
//   data: receipt_data, // 返回成功資料，讓 client-side 處理導航
// };
//   } catch (error) {
//     console.error("更新發票或創建收據時發生錯誤:", error);
//     return {
//       error: "操作失敗，請稍後重試",
//     };
//   }
// };

// export const IsPay_Change_Action = CreateSafeAction(IsPay_Change_Schema, handler);
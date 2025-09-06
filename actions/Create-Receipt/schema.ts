// import { z } from "zod"

// export const Receipt_Create_Schema = z.object({
//     title: z.string().min(1, { message: "Title is required" }),
//     content: z.array(z.string()),
//     price: z.number(),
//     PaymentMethods: z.string(),
//     studentname: z.string(),
//     DB: z.number(),
//     adminFee: z.number(),
// })


import { z } from "zod";

export const Receipt_Create_Schema = z.object({
  title: z.string().min(1, { message: "標題不能為空" }),
  content: z.array(z.string()).min(1, { message: "內容不能為空" }),
  price: z.number().min(0, { message: "價格必須大於等於0" }),
  DB: z.number().min(0, { message: "DB值必須大於等於0" }),
  adminFee: z.number().min(0, { message: "管理費用必須大於等於0" }),
  studentname: z.string().min(1, { message: "學生姓名不能為空" }),
  invoicebydbid: z.string().min(1, { message: "發票DB ID不能為空" }),
  Invoice_id: z.string().min(1, { message: "發票ID不能為空" }),
  servetype: z.string().min(1, { message: "服務類型不能為空" }),
  isPayment: z.boolean({ message: "支付狀態必須提供" }),
});
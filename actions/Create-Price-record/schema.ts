// import { z } from "zod";

// export const Price_Record_Create_Schema = z.object({
//     price: z.number(),
//     parent_name: z.string()
// })


import { z } from "zod";

export const Price_Record_Create_Schema = z.object({
  price: z.number().min(0, { message: "價格必須大於等於0" }),
  parent_name: z.string().min(1, { message: "家長名稱不能為空" }),
  productId: z.string().min(1, { message: "產品名稱不能為空" }), // 添加 product 字段
});
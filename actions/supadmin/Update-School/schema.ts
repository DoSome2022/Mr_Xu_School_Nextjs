// import { z } from "zod";

// export const SupSchool_Update_Schema = z.object({
//     supadminId: z.string(),
//     school_name : z.string(),
//     school_id : z.string(),
//     chine_date : z.string(),
//     eng_date : z.string(),
//     math_date : z.string(),
// })

// actions/supadmin/Update-School/schema.ts

import { z } from "zod";

export const SupSchool_Update_Schema = z.object({
  supadminId: z.string(),
  school_id: z.string().min(1, "學校ID不能為空"),
  school_name: z.string().min(1, "學校名稱不能為空"),
  grade: z.number().int().min(1, "年級必須為正整數"),
  quarter: z.number().int().min(1, "學期必須為正整數").max(4, "學期必須在1到4之間"),
  chine_data: z.string().optional(),
  math_data: z.string().optional(),
  eng_data: z.string().optional(),
});
// import { z } from "zod";

// export const Score_Create_Schema = z.object({
//     school_score_id : z.string(),
//     grade : z.number(),
//     subject : z.string(),
//     score : z .number(),
//     quarter : z.number(),
//     school_name : z.string(),
// })


// actions/Create-Score/schema.ts
import { z } from "zod";

export const Score_Create_Schema = z.object({
  school_score_id: z.string().min(1, "學生 ID 不可為空"),
  grade: z.number().min(0, "年級必須大於等於 0"),
  subject: z.string().min(1, "科目不可為空"),
  score: z.string().url("成績必須是有效的圖片 URL").optional(), // 改為 string 用於圖片 URL
  quarter: z.number().min(0, "季度必須大於等於 0"),
  student_name: z.string().min(1, "學生名字不可為空"),
  school_name: z.string().min(1, "學校名字不可為空"),
  school_id: z.string().min(1, "學校 ID 不可為空"),
});
import { z } from "zod";

export const Apply_Create_Schema = z.object({
    product_id: z.string(),
    username : z.string(),
    apply: z.boolean(),
    apply_student_id: z.string(),
    parentId: z.string(),
})
import { z } from "zod";

export const Parent_Data_Create_Schema = z.object({
    parent_user_id : z.string(),
    parent_message_id: z.string(),
    parent_price_record_id: z.string(),
    done: z.boolean()
})
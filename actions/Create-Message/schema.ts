import { z } from "zod";

export const Message_Create_Schema = z.object({
    message_content : z.string(),
    receiver : z.string(),
    sender: z.string(),
})
import { z } from "zod";

export const Sup_Apply_Reject_Schema = z.object({
    applyId: z.string(),
    supadminId: z.string(),
})
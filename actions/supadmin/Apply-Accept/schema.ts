import { z } from "zod";

export const Sup_Apply_Accept_Schema = z.object({
    applyId: z.string(),
    supadminId: z.string(),
})
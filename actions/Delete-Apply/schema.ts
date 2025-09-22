import { z } from "zod"; 

export const DeleteApply = z.object({
    id: z.string(),
})
import { z } from "zod"

export const public_holiday_edit_Schema = z.object({
    id: z.string(),
    publicholiday: z.array(z.string()),

})
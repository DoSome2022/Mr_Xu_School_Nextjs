import { z } from "zod"

export const public_holiday_create_Schema = z.object({

    publicholiday: z.array(z.string()),

})
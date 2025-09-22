import { z } from "zod"

export const Suppublic_holiday_create_Schema = z.object({
    supadminid: z.string(),
    publicholiday: z.array(z.string()),

})
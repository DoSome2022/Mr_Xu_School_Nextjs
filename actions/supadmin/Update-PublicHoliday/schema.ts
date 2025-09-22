import { z } from "zod"

export const Suppublic_holiday_edit_Schema = z.object({
    supadminid: z.string(),
    id: z.string(),
    publicholiday: z.array(z.string()),

})
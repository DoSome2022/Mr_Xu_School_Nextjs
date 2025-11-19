import { z } from "zod"; 

export const Create_Color_Schema = z.object({
    color_name: z.string()
})
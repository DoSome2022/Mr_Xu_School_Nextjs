import { z } from "zod";

export const School_Update_Schema = z.object({
    school_name : z.string(),
    school_id : z.string(),
    chine_date : z.string(),
    eng_date : z.string(),
    math_date : z.string(),
})
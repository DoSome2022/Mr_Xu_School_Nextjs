import { z } from "zod";

export const School_Create_Schema = z.object({
    school_name : z.string()

})
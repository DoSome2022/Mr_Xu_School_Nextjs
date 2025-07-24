import { z } from "zod";

export const SupSchool_Create_Schema = z.object({
    supadminid : z.string(),
    school_name : z.string()

})
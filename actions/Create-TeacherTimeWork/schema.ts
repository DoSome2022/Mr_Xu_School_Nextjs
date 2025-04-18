import { z } from "zod";

export const Teacher_time_work_Create_Schema = z.object({
    P_HR : z.number(),
    JHS_HR : z.number(),
    HS_HR : z.number(),
    P_number : z.number(),
    JHS_number : z.number(),
    HS_number : z.number(),
    teacherId : z.string(),
    classId : z.string(),
})
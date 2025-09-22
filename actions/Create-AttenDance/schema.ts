import { z } from "zod";

export const AttenDance_Create_Schema = z.object({
    classroomId: z.string(),
    studentId: z.string(),
    isPresent: z.boolean(),
    isLate: z.boolean(),
    subject: z.string(),
    grade: z.number(),
})
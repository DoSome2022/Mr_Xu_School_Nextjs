import { z } from "zod";

export const SupAddClass_Create_Schema = z.object({
    studentId : z.string(),
    currentclassId : z.string(),
    targetclassId: z.string(),
    class_date : z.string(),
    name : z.string(),
    student_class_date : z.string(),
    courseId: z.string(),
    supadminId: z.string(),
})
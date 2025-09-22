import { z } from "zod";

export const AddClass_Create_Schema = z.object({
    studentId : z.string(),
    currentclassId : z.string(),
    targetclassId: z.string(),
    class_date : z.string(),
    name : z.string(),
    student_class_date : z.string(),
    courseId: z.string(),
})
import { z } from "zod";

export const ChangeClass_Create_Schema = z.object({
    studentId : z.string(),
    targetclassId : z.string(),
    currentclassId : z.string(),
    class_date : z.string().date(),
    name : z.string(),
    student_class_date : z.string(),
    courseId    : z.string(),
})
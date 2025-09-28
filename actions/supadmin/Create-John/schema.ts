import { z } from "zod";

export const SupJoinStudent_Create_Schema = z.object({
    supadminId:z.string(),
    courseid : z.string(),
    studentId : z.string(),
    student : z.array(z.string()),
    course_name : z.string(),
    targetcourseId : z.string(),
})
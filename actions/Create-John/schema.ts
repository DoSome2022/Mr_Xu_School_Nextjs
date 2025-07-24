import { z } from "zod";

export const JoinStudent_Create_Schema = z.object({
    courseid : z.string(),
    studentId : z.string(),
    student : z.array(z.string()),
    course_name : z.string(),
    targetcourseId : z.string(),
})
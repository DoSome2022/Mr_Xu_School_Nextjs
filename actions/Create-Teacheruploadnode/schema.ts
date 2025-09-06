import { z } from "zod";

export const Teacher_upload_node_Create_Schema = z.object({
    name : z.string(),
    title : z.string(),
    subject : z.string(),
    author : z.string(),
    img : z.string(),
    answer : z.boolean(),
    lesson : z.string(),
    grade : z.number(),
    language : z.string(),
    teacherId : z.string(),

})
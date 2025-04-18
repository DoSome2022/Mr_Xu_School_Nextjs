import { z } from "zod";

export const Teacher_Data_Create_Schema = z.object({
    subject: z.array(z.string()),
    cram: z.string(),
    teacher_time_work_id: z.string(),
    teacher_upload_node_id: z.string(),
    teacher_user_id: z.string(),
    teacher_node_id: z.string(),
})
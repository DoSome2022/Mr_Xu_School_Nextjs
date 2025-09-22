import { z } from "zod";

export const AddStudent_Create_Schema = z.object({
  courseId: z.string().min(1, "課程 ID 不能為空"),
  student: z.array(z.string()).min(1, "必須選擇至少一個學生"),
});

export type InputType = z.infer<typeof AddStudent_Create_Schema>;
export type ReturnType = { data?: string; error?: string };
import { z } from "zod";

export const SupLeave_Student_schema = z.object({
  name: z.array(z.string()).min(1, "請至少選擇一名學生"),
  CourseId: z.string().min(1, "課程 ID 不可為空"),
  targetclassId: z.string().min(1, "目標班級 ID 不可為空"),
  currentclassId: z.string().min(1, "當前班級 ID 不可為空"),
  class_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "課程日期格式不正確"),
  date: z.string(),
});
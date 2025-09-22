import { z } from "zod";
import { parent_student_booklist_create_schema } from "./schema";
import { student_booklist } from "@prisma/client";

export type InputType = z.infer<typeof parent_student_booklist_create_schema>;

export type ReturnType = {
  success: boolean;
  data?: student_booklist;
  parentid?: string;
  student_booklist_id?: string;
  error?: string;
};
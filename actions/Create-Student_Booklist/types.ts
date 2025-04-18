import { z } from "zod";
import { student_booklist_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_booklist } from "@prisma/client";


export type InputType = z.infer<typeof student_booklist_Create_Schema>;
export type ReturnType = ActionState<InputType, student_booklist>

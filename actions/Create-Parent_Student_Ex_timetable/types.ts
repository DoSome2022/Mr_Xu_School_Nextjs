import { z } from "zod";
import { parent_student_ex_timetable_create_schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_ex_timetable } from "@prisma/client";

export type InputType = z.infer<typeof parent_student_ex_timetable_create_schema>;
export type ReturnType = ActionState<InputType, student_ex_timetable>;
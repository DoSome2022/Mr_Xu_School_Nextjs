import { z } from "zod";
import { student_school_timetable_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_school_timetable } from "@prisma/client";


export type InputType = z.infer<typeof student_school_timetable_Create_Schema>;
export type ReturnType = ActionState<InputType, student_school_timetable>

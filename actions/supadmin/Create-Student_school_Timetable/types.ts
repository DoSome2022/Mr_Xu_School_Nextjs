import { z } from "zod";
import { Supstudent_school_timetable_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_school_timetable } from "@prisma/client";


export type InputType = z.infer<typeof Supstudent_school_timetable_Create_Schema>;
export type ReturnType = ActionState<InputType, student_school_timetable>

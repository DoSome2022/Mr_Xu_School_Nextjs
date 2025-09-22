import { z } from "zod";
import { Ex_timetable_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Ex_timetable } from "@prisma/client";

export type InputType = z.infer<typeof Ex_timetable_Create_Schema>;

export type ReturnType = ActionState<InputType, Ex_timetable> & {
  school_ex_time_id?: string;
};
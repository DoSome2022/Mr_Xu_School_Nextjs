import { z } from "zod";
import { School_timetable_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { School_timetable } from "@prisma/client";

export type InputType = z.infer<typeof School_timetable_Create_Schema>;

export type ReturnType = ActionState<InputType, School_timetable> & {
  school_school_timetable_id?: string;
};
import { z } from "zod";
import { LessonCal_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Lesson_calendar } from "@prisma/client";


export type InputType = z.infer<typeof LessonCal_Update_Schema>;
export type ReturnType = ActionState<InputType, Lesson_calendar>

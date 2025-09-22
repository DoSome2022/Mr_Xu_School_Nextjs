import { z } from "zod";
import { Teacher_time_work_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Teacher_time_work } from "@prisma/client";


export type InputType = z.infer<typeof Teacher_time_work_Create_Schema>;
export type ReturnType = ActionState<InputType, Teacher_time_work>

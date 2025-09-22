import { z } from "zod";
import { Student_ExDay_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Student } from "@prisma/client";


export type InputType = z.infer<typeof Student_ExDay_Update_Schema>;
export type ReturnType = ActionState<InputType, Student>

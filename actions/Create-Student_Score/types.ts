import { z } from "zod";
import { student_score_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_score } from "@prisma/client";


export type InputType = z.infer<typeof student_score_Create_Schema>;
export type ReturnType = ActionState<InputType, student_score>

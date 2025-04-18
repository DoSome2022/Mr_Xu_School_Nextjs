import { z } from "zod";
import { parent_student_score_create_schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_score } from "@prisma/client";


export type InputType = z.infer<typeof parent_student_score_create_schema>;
export type ReturnType = ActionState<InputType, student_score>

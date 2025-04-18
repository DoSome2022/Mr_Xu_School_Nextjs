import { z } from "zod";
import { student_ex_scope_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_ex_scope } from "@prisma/client";


export type InputType = z.infer<typeof student_ex_scope_Create_Schema>;
export type ReturnType = ActionState<InputType, student_ex_scope>

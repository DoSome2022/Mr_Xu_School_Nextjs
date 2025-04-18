import { z } from "zod";
import { student_parent_create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Student } from "@prisma/client";


export type InputType = z.infer<typeof student_parent_create_Schema>;
export type ReturnType = ActionState<InputType, Student>

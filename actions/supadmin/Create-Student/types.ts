import { z } from "zod";
import { SupStudent_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Student } from "@prisma/client";


export type InputType = z.infer<typeof SupStudent_Create_Schema>;
export type ReturnType = ActionState<InputType, Student>

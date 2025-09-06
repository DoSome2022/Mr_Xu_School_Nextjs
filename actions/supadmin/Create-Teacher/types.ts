import { z } from "zod";
import { SupTeacher_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { StaffUser } from "@prisma/client";


export type InputType = z.infer<typeof SupTeacher_Create_Schema>;
export type ReturnType = ActionState<InputType, StaffUser>

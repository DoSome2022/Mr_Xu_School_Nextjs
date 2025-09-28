import { z } from "zod";
import { SupTeacher_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { StaffUser } from "@prisma/client";


export type InputType = z.infer<typeof SupTeacher_Update_Schema>;
export type ReturnType = ActionState<InputType, StaffUser>

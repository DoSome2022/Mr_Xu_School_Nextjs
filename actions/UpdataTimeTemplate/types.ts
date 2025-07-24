import { z } from "zod";
import { timetemplate_create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { StaffUser } from "@prisma/client";


export type InputType = z.infer<typeof timetemplate_create_Schema>;
export type ReturnType = ActionState<InputType, StaffUser>

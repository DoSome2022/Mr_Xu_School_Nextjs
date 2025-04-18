import { z } from "zod";
import { Teacher_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { StaffUser } from "@prisma/client";


export type InputType = z.infer<typeof Teacher_Update_Schema>;
export type ReturnType = ActionState<InputType, StaffUser>

import { z } from "zod";
import { Admin_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { StaffUser } from "@prisma/client";


export type InputType = z.infer<typeof Admin_Create_Schema>;
export type ReturnType = ActionState<InputType, StaffUser>

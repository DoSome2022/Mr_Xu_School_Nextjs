import { ActionState } from "@/lib/create-safe-action";
import { public_holiday } from "@prisma/client";
import { z } from "zod"
import { Suppublic_holiday_create_Schema } from "./schema";



export type InputType = z.infer<typeof Suppublic_holiday_create_Schema>;
export type ReturnType = ActionState<InputType, public_holiday>
import { ActionState } from "@/lib/create-safe-action";
import { timetemplate } from "@prisma/client";
import { z } from "zod"
import { public_holiday_create_Schema } from "./schema";



export type InputType = z.infer<typeof public_holiday_create_Schema>;
export type ReturnType = ActionState<InputType, timetemplate>
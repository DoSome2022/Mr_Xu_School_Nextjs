import { ActionState } from "@/lib/create-safe-action";
import { public_holiday } from "@prisma/client";
import { z } from "zod"
import { public_holiday_edit_Schema } from "./schema";



export type InputType = z.infer<typeof public_holiday_edit_Schema>;
export type ReturnType = ActionState<InputType, public_holiday>
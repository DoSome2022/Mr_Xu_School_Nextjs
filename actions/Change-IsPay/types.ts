import { ActionState } from "@/lib/create-safe-action";
import { Invoice } from "@prisma/client";
import { z } from "zod"
import { IsPay_Change_Schema } from "./schema";




export type InputType = z.infer<typeof IsPay_Change_Schema>;
export type ReturnType = ActionState<InputType, Invoice>
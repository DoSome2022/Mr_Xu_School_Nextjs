import { ActionState } from "@/lib/create-safe-action";
import { Receipt } from "@prisma/client";
import { z } from "zod"
import { Receipt_Create_Schema } from "./schema";




export type InputType = z.infer<typeof Receipt_Create_Schema>;
export type ReturnType = ActionState<InputType, Receipt>
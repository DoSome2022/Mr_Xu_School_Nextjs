import { z } from "zod";
import { Apply_Reject_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Apply } from "@prisma/client";


export type InputType = z.infer<typeof Apply_Reject_Schema>;
export type ReturnType = ActionState<InputType, Apply>



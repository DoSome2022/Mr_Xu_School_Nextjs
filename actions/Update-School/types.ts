import { z } from "zod";
import { School_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { School } from "@prisma/client";


export type InputType = z.infer<typeof School_Update_Schema>;
export type ReturnType = ActionState<InputType, School>

import { z } from "zod";
import { SupClass_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Class } from "@prisma/client";


export type InputType = z.infer<typeof SupClass_Update_Schema>;
export type ReturnType = ActionState<InputType, Class>

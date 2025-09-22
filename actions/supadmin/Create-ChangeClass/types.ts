import { z } from "zod";
import { SupChangeClass_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { ChangeClass } from "@prisma/client";


export type InputType = z.infer<typeof SupChangeClass_Create_Schema>;
export type ReturnType = ActionState<InputType, ChangeClass>

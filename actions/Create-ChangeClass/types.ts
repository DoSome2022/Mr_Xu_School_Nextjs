import { z } from "zod";
import { ChangeClass_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { ChangeClass } from "@prisma/client";


export type InputType = z.infer<typeof ChangeClass_Create_Schema>;
export type ReturnType = ActionState<InputType, ChangeClass>

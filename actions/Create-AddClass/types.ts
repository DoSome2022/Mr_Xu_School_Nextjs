import { z } from "zod";
import { AddClass_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { AddClass } from "@prisma/client";


export type InputType = z.infer<typeof AddClass_Create_Schema>;
export type ReturnType = ActionState<InputType, AddClass>

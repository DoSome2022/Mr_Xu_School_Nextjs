import { z } from "zod";
import { SupAddClass_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { AddClass } from "@prisma/client";


export type InputType = z.infer<typeof SupAddClass_Create_Schema>;
export type ReturnType = ActionState<InputType, AddClass>

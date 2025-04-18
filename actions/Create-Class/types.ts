import { z } from "zod";
import { Class_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Class } from "@prisma/client";


export type InputType = z.infer<typeof Class_Create_Schema>;
export type ReturnType = ActionState<InputType, Class>

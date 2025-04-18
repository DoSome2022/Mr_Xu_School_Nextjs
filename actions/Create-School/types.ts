import { z } from "zod";
import { School_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { School } from "@prisma/client";


export type InputType = z.infer<typeof School_Create_Schema>;
export type ReturnType = ActionState<InputType, School>

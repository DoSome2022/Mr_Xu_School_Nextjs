import { z } from "zod"; 
import { Apply } from "@prisma/client";
import { ActionState } from "@/lib/create-safe-action";
import { DeleteApply } from "./schema";

export type InputType = z.infer<typeof DeleteApply>;
export type ReturnType = ActionState<InputType, Apply>;
import { z } from "zod";
import { VoidCreateSchema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { voidRecord } from "@prisma/client";


export type InputType = z.infer<typeof VoidCreateSchema>;
export type ReturnType = ActionState<InputType, voidRecord>;
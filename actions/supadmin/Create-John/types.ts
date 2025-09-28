import { ActionState } from "@/lib/create-safe-action";
import { Invoice } from "@prisma/client";
import { z } from "zod"
import { SupJoinStudent_Create_Schema } from "./schema";

export type InputType = z.infer<typeof SupJoinStudent_Create_Schema>;
export type ReturnType = ActionState<InputType, Invoice>
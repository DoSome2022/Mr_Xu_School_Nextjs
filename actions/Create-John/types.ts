import { ActionState } from "@/lib/create-safe-action";
import { Invoice } from "@prisma/client";
import { z } from "zod"
import { JoinStudent_Create_Schema } from "./schema";

export type InputType = z.infer<typeof JoinStudent_Create_Schema>;
export type ReturnType = ActionState<InputType, Invoice>
import { z } from "zod";
import { Score_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Score } from "@prisma/client";


export type InputType = z.infer<typeof Score_Create_Schema>;
export type ReturnType = ActionState<InputType, Score>

import { z } from "zod";
import { Parent_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { User } from "@prisma/client";


export type InputType = z.infer<typeof Parent_Update_Schema>;
export type ReturnType = ActionState<InputType, User>

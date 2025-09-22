import { z } from "zod";
import { SupParent_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { User } from "@prisma/client";


export type InputType = z.infer<typeof SupParent_Create_Schema>;
export type ReturnType = ActionState<InputType, User>

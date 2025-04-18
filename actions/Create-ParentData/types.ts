import { z } from "zod";
import { Parent_Data_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Parent_data } from "@prisma/client";


export type InputType = z.infer<typeof Parent_Data_Create_Schema>;
export type ReturnType = ActionState<InputType, Parent_data>

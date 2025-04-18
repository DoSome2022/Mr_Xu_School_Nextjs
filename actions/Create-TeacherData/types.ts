import { z } from "zod";
import { Teacher_Data_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Teacher_data } from "@prisma/client";


export type InputType = z.infer<typeof Teacher_Data_Create_Schema>;
export type ReturnType = ActionState<InputType, Teacher_data>

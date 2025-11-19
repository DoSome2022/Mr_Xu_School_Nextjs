import { z } from "zod"; 
import { Create_Color_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { color } from "@prisma/client";


export type InputType = z.infer<typeof Create_Color_Schema>;
export type ReturnType = ActionState<InputType , color>
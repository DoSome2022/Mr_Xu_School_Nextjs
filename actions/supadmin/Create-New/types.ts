import { z } from "zod";
import { SupNews_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { News } from "@prisma/client";


export type InputType = z.infer<typeof SupNews_Create_Schema>;
export type ReturnType = ActionState<InputType , News>

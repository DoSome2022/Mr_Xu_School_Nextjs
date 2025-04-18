import { z } from "zod";
import { News_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { News } from "@prisma/client";


export type InputType = z.infer<typeof News_Update_Schema>;
export type ReturnType = ActionState<InputType , News>

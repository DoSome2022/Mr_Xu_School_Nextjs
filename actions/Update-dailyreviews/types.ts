import { z } from "zod";
import { Update_Dailyreviews_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { dailyreviews } from "@prisma/client";


export type InputType = z.infer<typeof Update_Dailyreviews_Schema>;
export type ReturnType = ActionState<InputType, dailyreviews>

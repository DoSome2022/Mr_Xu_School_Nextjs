import { z } from "zod";
import { Message_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Message } from "@prisma/client";


export type InputType = z.infer<typeof Message_Create_Schema>;
export type ReturnType = ActionState<InputType, Message>

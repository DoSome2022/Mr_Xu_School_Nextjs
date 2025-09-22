import { z } from "zod";
import { Comment_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Comment } from "@prisma/client";


export type InputType = z.infer<typeof Comment_Create_Schema>;
export type ReturnType = ActionState<InputType, Comment>

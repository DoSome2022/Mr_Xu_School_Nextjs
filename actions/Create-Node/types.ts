import { z } from "zod";
import { Node_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Node } from "@prisma/client";


export type InputType = z.infer<typeof Node_Create_Schema>;
export type ReturnType = ActionState<InputType, Node>

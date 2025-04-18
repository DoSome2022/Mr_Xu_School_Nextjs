import { z } from "zod";
import { Ex_scope_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Ex_scope} from "@prisma/client";


export type InputType = z.infer<typeof Ex_scope_Create_Schema>;
export type ReturnType = ActionState<InputType, Ex_scope>

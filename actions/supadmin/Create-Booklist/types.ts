import { z } from "zod";
import { SupBooklist_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Booklist } from "@prisma/client";


export type InputType = z.infer<typeof SupBooklist_Create_Schema>;
export type ReturnType = ActionState<InputType, Booklist>

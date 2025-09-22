import { z } from "zod";
import { SupProduct_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Product } from "@prisma/client";


export type InputType = z.infer<typeof SupProduct_Update_Schema>;
export type ReturnType = ActionState<InputType, Product>

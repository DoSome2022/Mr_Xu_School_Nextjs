import { z } from "zod";
import { SupProduct_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Product } from "@prisma/client";


export type InputType = z.infer<typeof SupProduct_Create_Schema>;
export type ReturnType = ActionState<InputType, Product>

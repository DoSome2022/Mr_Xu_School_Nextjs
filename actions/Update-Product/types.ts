import { z } from "zod";
import { Product_Update_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Product } from "@prisma/client";


export type InputType = z.infer<typeof Product_Update_Schema>;
export type ReturnType = ActionState<InputType, Product>

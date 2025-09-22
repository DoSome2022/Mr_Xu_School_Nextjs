import { z } from "zod";
import { School_Ex_Day_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { School_EX_Day } from "@prisma/client";


export type InputType = z.infer<typeof School_Ex_Day_Schema>;
export type ReturnType = ActionState<InputType, School_EX_Day>

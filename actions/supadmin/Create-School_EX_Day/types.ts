import { z } from "zod";
import { SupSchool_Ex_Day_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { School_EX_Day } from "@prisma/client";


export type InputType = z.infer<typeof SupSchool_Ex_Day_Schema>;
export type ReturnType = ActionState<InputType, School_EX_Day>

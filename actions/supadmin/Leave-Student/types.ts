import { z } from "zod";
import { SupLeave_Student_schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Leave } from "@prisma/client";


export type InputType = z.infer<typeof SupLeave_Student_schema>;
export type ReturnType = ActionState<InputType, Leave>

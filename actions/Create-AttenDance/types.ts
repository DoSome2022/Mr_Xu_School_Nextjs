import { z } from "zod";
import { AttendRollCall_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { AttendRollCall } from "@prisma/client";


export type InputType = z.infer<typeof AttendRollCall_Create_Schema>;
export type ReturnType = ActionState<InputType, AttendRollCall>

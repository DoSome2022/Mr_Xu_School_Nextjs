import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { Classroom } from "@prisma/client";
import { SupCreateClassRoomSchema } from "./schema";

export type InputType = z.infer<typeof SupCreateClassRoomSchema>;
export type ReturnType = ActionState<InputType , Classroom>
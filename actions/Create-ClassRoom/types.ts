import { z } from "zod"; 
import { ActionState } from "@/lib/create-safe-action";
import { Classroom } from "@prisma/client";
import { CreateClassRoomSchema } from "./schema";

export type InputType = z.infer<typeof CreateClassRoomSchema>;
export type ReturnType = ActionState<InputType , Classroom>
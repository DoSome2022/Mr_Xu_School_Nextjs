import { z } from "zod";
import { SupAddStudent_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Course } from "@prisma/client";


export type InputType = z.infer<typeof SupAddStudent_Create_Schema>;
export type ReturnType = ActionState<InputType, Course>

import { z } from "zod";
import { Course_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Course } from "@prisma/client";


export type InputType = z.infer<typeof Course_Create_Schema>;
export type ReturnType = ActionState<InputType, Course>

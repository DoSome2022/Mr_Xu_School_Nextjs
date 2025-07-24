import { z } from "zod";
import { Supstudent_ex_paper_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_ex_paper } from "@prisma/client";


export type InputType = z.infer<typeof Supstudent_ex_paper_Create_Schema>;
export type ReturnType = ActionState<InputType, student_ex_paper>

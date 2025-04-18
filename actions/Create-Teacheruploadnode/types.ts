import { z } from "zod";
import { Teacher_upload_node_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Teacher_upload_node } from "@prisma/client";


export type InputType = z.infer<typeof Teacher_upload_node_Create_Schema>;
export type ReturnType = ActionState<InputType, Teacher_upload_node>

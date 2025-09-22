import { z } from "zod";
import { Booklist_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Booklist } from "@prisma/client";

export type InputType = z.infer<typeof Booklist_Create_Schema>;

export type ReturnType = ActionState<InputType, Booklist> & {
  school_booklist_id?: string;
};
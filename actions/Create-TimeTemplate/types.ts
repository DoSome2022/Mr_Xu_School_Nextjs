// import { ActionState } from "@/lib/create-safe-action";
// import { timetemplate } from "@prisma/client";
// import { z } from "zod"
// import { timetemplate_create_Schema } from "./schema";



// export type InputType = z.infer<typeof timetemplate_create_Schema>;
// export type ReturnType = ActionState<InputType, timetemplate>


import { z } from "zod";
import { timetemplate_create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { timetemplate } from "@prisma/client";

export type InputType = z.infer<typeof timetemplate_create_Schema>;
export type ReturnType = ActionState<InputType, timetemplate>;
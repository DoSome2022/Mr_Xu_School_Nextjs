// import { z } from "zod";
// import { Price_Record_Create_Schema } from "./schema";
// import { ActionState } from "@/lib/create-safe-action";
// import { Price_record } from "@prisma/client";


// export type InputType = z.infer<typeof Price_Record_Create_Schema>;
// export type ReturnType = ActionState<InputType, Price_record>


import { z } from "zod";
import { Price_Record_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { Price_record } from "@prisma/client";

export type InputType = z.infer<typeof Price_Record_Create_Schema>;
export type ReturnType = ActionState<InputType, Price_record>;
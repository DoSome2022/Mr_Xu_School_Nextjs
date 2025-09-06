// import { z } from "zod";
// import { AttenDance_Create_Schema } from "./schema";
// import { ActionState } from "@/lib/create-safe-action";
// import { AttenDance } from "@prisma/client";


// export type InputType = z.infer<typeof AttenDance_Create_Schema>;
// export type ReturnType = ActionState<InputType, AttenDance>


import { z } from "zod";
import { AttenDance_Create_Schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { AttenDance } from "@prisma/client";

export type InputType = z.infer<typeof AttenDance_Create_Schema>;
export type ReturnType = ActionState<InputType[], AttenDance[]>;
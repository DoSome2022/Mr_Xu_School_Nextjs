// actions/Change-IsPay/types.ts
import { z } from "zod";
import { IsPay_Change_Schema } from "./schema";

export type InputType = z.infer<typeof IsPay_Change_Schema>;
export type ReturnType = 
  | { success: string; data?: any; error?: never }
  | { error: string; success?: never; data?: never };

  
// // types.ts
// import { ActionState } from "@/lib/create-safe-action";
// import { Receipt } from "@prisma/client"; // 改用 Receipt
// import { z } from "zod";
// import { IsPay_Change_Schema } from "./schema";

// export type InputType = z.infer<typeof IsPay_Change_Schema>;
// export type ReturnType = ActionState<InputType, Receipt>;
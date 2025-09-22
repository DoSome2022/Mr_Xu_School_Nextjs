// import { z } from "zod";
// import { parent_student_ex_pager_create_schema } from "./schema";
// import { ActionState } from "@/lib/create-safe-action";
// import { student_ex_paper } from "@prisma/client";


// export type InputType = z.infer<typeof parent_student_ex_pager_create_schema>;
// export type ReturnType = ActionState<InputType, student_ex_paper>


import { z } from "zod";
import { parent_student_ex_pager_create_schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_ex_paper } from "@prisma/client";

export type InputType = z.infer<typeof parent_student_ex_pager_create_schema>;

export type ReturnType = ActionState<InputType, student_ex_paper> & {
  parentid?: string; // 擴展額外字段
  student_ex_paper_id?: string;
};
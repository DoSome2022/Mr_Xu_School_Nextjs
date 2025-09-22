// import { z } from "zod";
// import { parent_student_school_timetable_create_schema } from "./schema";
// import { ActionState } from "@/lib/create-safe-action";
// import { student_school_timetable } from "@prisma/client";


// export type InputType = z.infer<typeof parent_student_school_timetable_create_schema>;
// export type ReturnType = ActionState<InputType, student_school_timetable>


import { z } from "zod";
import { parent_student_school_timetable_create_schema } from "./schema";
import { ActionState } from "@/lib/create-safe-action";
import { student_school_timetable } from "@prisma/client";

export type InputType = z.infer<typeof parent_student_school_timetable_create_schema>;

export type ReturnType = ActionState<InputType, student_school_timetable> & {
  parentid?: string;
  student_school_timetable_id?: string;
};
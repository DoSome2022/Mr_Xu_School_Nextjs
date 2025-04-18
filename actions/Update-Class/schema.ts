import { z } from "zod";


export const Class_Update_Schema = z.object({
  classId: z.string(),
  freq: z.string(),
  byweekday: z.string(),
  title: z.string(),
  allDay : z.boolean(),
  class_start_time: z.string(),
  class_end_time: z.string(),
  class_time_h : z.number(),
  classroom: z.string(),
  class_lesson: z.string(),
  class_course_id: z.string(),
  attend_number: z.number(),
  persons: z.number(),
  node: z.number(),
  teacher: z.string(),
  grade: z.number(),


  cram: z.string(),
  class_date: z.array(z.date()),
    // classId:z.string(),
    // class_time_h : z.number(),
    // cram: z.string(),
    // classroom: z.string(),
    // persons: z.number(),
    // class_course_id: z.string(),
    // class_lesson: z.string(),
    // class_date: z.array(z.date()),
    // class_start_time: z.string(),
    // class_end_time: z.string(),
    // attend_number: z.number(),
    // teacher: z.string(),
    // node: z.number()
})

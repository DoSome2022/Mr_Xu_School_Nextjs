// types/course.ts
export interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  persons: number;
  teacher: string;
  grade: number;
  course_level?: string; // 可選，因為 API 可能不返回
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  days: { date: string; start_time: string; end_time: string; lesson: string }[];
  weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
  publicholiday_model: string[];
  TimeTemplateID: string;
  classroom: string;
  isshow: boolean;
  class: { id: string; class_lesson: string; class_date: string }[];
  student: { id: string; name: string }[];
  joinStudent: { id: string; student_name: string }[];
}
// lib/types.ts

export interface CalendarEvent {
  id: string; // 根據 ClassRoomCalendar 的定義，id 應為 string
  title: string;
  start: string;
  end: string;
}

export interface ClassRoom {
  id: string;
  room: string;
  Class: Class[];
  Course: Course[];
}

export interface Course {
  id: string;
  course_name: string;
  course_subject: string;
  course_teacher_data_id: string[];
  TimeTemplateID: string;
  day_start: string;
  day_end: string;
  start_time: string;
  end_time: string;
  days: { date: string; start_time: string; end_time: string; lesson: string }[];
  weekdays: { date: string; start_time: string; end_time: string; lesson: string }[];
  publicholiday_model: string[];
  grade: number;
  persons: number;
  teacher: string;
  isshow: boolean;
  craetedAt: string; // 注意拼寫錯誤，應為 createdAt
  updatedAt: string;
}

// lib/types.ts
export interface Class {
  id: string;
  class_date: string;
  class_start_time: string;
  class_end_time: string;
  class_subject: string;
  teacher: string;
  persons: number;
  title: string;
  grade: number;
  class_course_id: string;
  class_course: {
    id: string;
    course_name: string;
    day_start: string;
    day_end: string;
    start_time: string;
    end_time: string;
  };
  student: { name: string }[];
  Leave: { name: string }[];
  addClass: { name: string }[];
  change_class: {
    id: string;
    name: string;
    currentclassId: string;
    targetclassId: string;
    date: string;
    class_date: string;
    createData: string;
  }[];
  isshow: boolean; // 添加 isshow 屬性
}
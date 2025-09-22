export interface Student {
  id: string;
  name: string;
  school?: string;
  grade?: number;
}

export interface TeacherData {
  id: string;
  username?: string | null;
  nickname: string;
  email: string;
  phone: string;
  password: string;
  Staff: boolean;
  ISADMIN: boolean;
  role: 'ADMIN' | 'SUPADMIN' | 'TEACHER' | 'PARENT' | 'USER';
  Student: Student[];
  Course?: {
    id: string;
    course_name: string;
    class?: {
      id: string;
      student: Student[];
    }[];
  }[];
  teacher_time_work?: unknown[];
  teacher_upload_node?: unknown[];
  teacher_node?: unknown[];
}
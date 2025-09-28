"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useParams } from "next/navigation";
import TeacherNavber from "../_components/navbar";
import Link from "next/link";

interface Student {
  id: string;
  name: string;
}

interface Course {
  id: string;
  course_name: string;
  start_time: string;
  end_time: string;
  day_start: string;
  day_end: string;
  student: Student[];
  teacher: string;
  grade: number;
  persons: number;
  publicholiday_model: string[];
  weekdays: string[];
  days: string[];
}

interface CourseData {
  Course: Course[];
  ISADMIN: boolean;
  Staff: boolean;
  email: string;
  id: string;
  nickname: string;
  // 其他教師相關欄位
}

export default function TeacherCalendarPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const param = useParams();
  const teacherId = param?.teacherId as string;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/teacher/${session.user.id}/courses`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!response.ok) throw new Error("無法獲取課程數據");
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error("獲取課程失敗:", error);
        setError("無法載入課程數據，請稍後重試");
      }
    };

    fetchCourses();
  }, [session]);

  console.log("coursescomeback :", courses, "-- End --");

  // 格式化時間（將 "0000" 或 "0500" 轉為 "00:00:00" 或 "05:00:00"）
  const formatTime = (time: string | null | undefined): string | undefined => {
    if (!time) return undefined;
    if (/^\d{4}$/.test(time)) {
      return `${time.slice(0, 2)}:${time.slice(2, 4)}:00`; // 將 "0000" 轉為 "00:00:00"
    }
    if (/^\d{2}:\d{2}$/.test(time)) {
      return `${time}:00`; // 將 "00:00" 轉為 "00:00:00"
    }
    return undefined; // 無效格式返回 undefined
  };

  // 格式化日期，確保返回 string | undefined
  const formatEventDate = (date: string | null | undefined, time: string | undefined): string | undefined => {
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return undefined;
    const formattedTime = time ? formatTime(time) : "09:00:00"; // 默認 9:00
    return `${date}T${formattedTime}`;
  };

  // 準備 FullCalendar 事件
  const calendarEvents = courses
    .flatMap((courseData) =>
      courseData.Course.flatMap((course) => {
        // 使用 weekdays 或 days（優先使用 weekdays）
        const eventDates = course.weekdays.length > 0 ? course.weekdays : course.days;
        return eventDates
          .filter((date) => date && /^\d{4}-\d{2}-\d{2}$/.test(date)) // 確保日期有效
          .map((date) => ({
            title: `${course.course_name} (${(course.student || []).length} 名學生)`,
            start: formatEventDate(date, course.start_time),
            end: formatEventDate(date, course.end_time || course.start_time), // 如果 end_time 無效，使用 start_time
            classNames: [
              "bg-blue-100",
              "text-blue-800",
              "border-blue-200",
              "hover:bg-blue-200",
              "cursor-pointer",
            ],
            extendedProps: { courseId: course.id }, // 存儲 courseId 以便點擊時使用
          }));
      })
    )
    .filter((event) => event.start && event.end); // 過濾無效事件

  console.log("calendarEvents :", calendarEvents, "-- End --");

  if (error) {
    return (
      <div className="container mx-auto p-4 bg-[#80A8BD] border border-blue-200">
        <TeacherNavber teacherId={teacherId} />
        <h1 className="text-2xl font-bold text-blue-600 mb-4">教師課程表</h1>
        <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-[#80A8BD] border border-blue-200">
      <TeacherNavber teacherId={teacherId} />
      <h1 className="text-2xl font-bold text-blue-600 mb-4">教師課程表</h1>

      {/* FullCalendar */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-8">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          initialDate="2025-09-01" // 設置初始日期為 2025 年 9 月
          events={calendarEvents}
          eventClick={(info) => {
            const course = courses
              .flatMap((courseData) => courseData.Course)
              .find((c) => c.id === info.event.extendedProps.courseId);
            if (course) {
              const studentNames = (course.student || []).map((s) => s.name).join(", ") || "無學生";
              alert(`課程: ${course.course_name}\n學生名單: ${studentNames}`);
            }
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          eventContent={({ event }) => (
            <div className="p-1 text-blue-600">{event.title}</div>
          )}
          dayCellClassNames="border-blue-200"
          eventBorderColor="#bfdbfe"
          eventBackgroundColor="#dbeafe"
        />
      </div>

      {/* 課程列表 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-blue-600 mb-4">課程列表</h2>
        {courses.length === 0 ? (
          <p className="text-gray-600">暫無課程數據</p>
        ) : (
          <div className="grid gap-4">
            {courses.flatMap((courseData) =>
              courseData.Course.map((course) => (
                <Link href={`/teacher/${teacherId}/courseLists/${course.id}`}>
                <div
                  key={course.id}
                  className="border border-gray-200 rounded-md p-4 hover:bg-gray-50 transition-colors duration-300"
                >
                  <h3 className="text-lg font-semibold text-gray-800">{course.course_name}</h3>
                  <div className="mt-2 space-y-1 text-gray-600">
                    <p>
                      <span className="font-medium">開始日期：</span>
                      {course.day_start || "未設置"}
                    </p>
                    <p>
                      <span className="font-medium">結束日期：</span>
                      {course.day_end || "未設置"}
                    </p>
                    <p>
                      <span className="font-medium">課程日期：</span>
                      {course.weekdays.length > 0 ? course.weekdays.join(", ") : "無"}
                    </p>
                    <p>
                      <span className="font-medium">年級：</span>
                      {course.grade || "未知"}
                    </p>
                    <p>
                      <span className="font-medium">人數上限：</span>
                      {course.persons || "無限制"}
                    </p>
                    <p>
                      <span className="font-medium">教師：</span>
                      {course.teacher || "未分配"}
                    </p>
                    <p>
                      <span className="font-medium">學生名單：</span>
                      {(course.student || []).map((s) => s.name).join(", ") || "無學生"}
                    </p>
                    <p>
                      <span className="font-medium">公眾假期：</span>
                      {course.publicholiday_model?.length > 0
                        ? course.publicholiday_model.join(", ")
                        : "無"}
                    </p>
                  </div>
                </div>
                
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
// "use client";

// import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { useParams } from "next/navigation";
// import TeacherNavber from "../_components/navbar";

// interface Course {
//   id: string;
//   course_name: string;
//   start_time: string;
//   end_time: string;
//   day_start: string; // 添加 day_start
//   day_end: string;   // 添加 day_end
//   student: { id: string; name: string }[]; // 改為 student
// }

// export default function TeacherCalendarPage() {
//   const { data: session } = useSession();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const param = useParams();
//   const teacherId = param?.teacherId as string;

//   useEffect(() => {
//     const fetchCourses = async () => {
//       if (!session?.user?.id) return;
//       try {
//         const response = await fetch(`/api/teacher/${session.user.id}/courses`);
//         if (!response.ok) throw new Error("無法獲取課程數據");
//         const data = await response.json();
//         setCourses(data);
//       } catch (error) {
//         console.error("獲取課程失敗:", error);
//       }
//     };

//     fetchCourses();
//   }, [session]);

//   console.log("courses :", courses, "-- End --");

//   return (
//     <div className="container mx-auto p-4 bg-[#80A8BD] border border-blue-200">
//       <TeacherNavber teacherId={teacherId} />
//       <h1 className="text-2xl font-bold text-blue-600 mb-4">教師課程表</h1>

//       <div className="bg-[#80A8BD] p-4 rounded-lg shadow-md">
//         <FullCalendar
//           plugins={[dayGridPlugin]}
//           initialView="dayGridMonth"
//           events={courses.map((course) => ({
//             title: `${course.course_name} (${(course.student || []).length} 名學生)`,
//             start: course.start_time || course.day_start, // 使用 day_start 作為備用
//             end: course.end_time || course.day_end,       // 使用 day_end 作為備用
//             classNames: [
//               "bg-blue-100",
//               "text-blue-800",
//               "border-blue-200",
//               "hover:bg-blue-200",
//               "cursor-pointer",
//             ],
//           }))}
//           eventClick={(info) => {
//             const course = courses.find((c) => c.course_name === info.event.title.split(" (")[0]);
//             if (course) {
//               const studentNames = (course.student || []).map((s) => s.name).join(", ") || "無學生";
//               alert(`學生名單: ${studentNames}`);
//             }
//           }}
//           headerToolbar={{
//             left: "prev,next today",
//             center: "title",
//             right: "dayGridMonth,dayGridWeek,dayGridDay",
//           }}
//           eventContent={({ event }) => (
//             <div className="p-1 text-blue-600">{event.title}</div>
//           )}
//           dayCellClassNames="border-blue-200"
//           eventBorderColor="#bfdbfe"
//           eventBackgroundColor="#dbeafe"
//         />
//       </div>
//     </div>
//   );
// }
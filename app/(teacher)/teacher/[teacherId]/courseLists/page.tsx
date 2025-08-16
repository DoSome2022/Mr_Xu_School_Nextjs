// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import { useSession } from "next-auth/react";
// import TeacherNavber from "../_components/navbar";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// const CourseLists = () => {
//     const session = useSession();

//     console.log("--teacher_session data : --  ",session?.data?.user,"-- END --")
  
//     const teacherId = session?.data.user?.id ; 
  
//     console.log("id : " , teacherId);

//         const [ GetTeacherData , setGetTeacherData ] = useState([]);
    
//         useEffect(()=>{
//           if(teacherId){
//             const fetchTeacherData = async (id:string) => {
//               try {
//                 const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
//                 if (!response.ok) {
//                   throw new Error("Failed to fetch teacher data");
//                 }
//                 const data = await response.json();
//                 setGetTeacherData(data);
//               } catch (error) {
//                 console.error("Errorfetching teacher data:", error);
//               }
//             }
//             fetchTeacherData(teacherId)
//           }
//         },[teacherId])
    
//         console.log("--teacher_data : --  ",GetTeacherData,"-- END --")
//         const CourseData = GetTeacherData[0]?.Course;

//     return(
//         <>
//         <div>
//             <p>CourseLists</p>
//             {CourseData?.map((data:any)=>{
//                 return(

//                     <>
//                     <Link href={`/teacher/${teacherId}/courseLists/${data.id}`}>
//                     <br />
//                     課程名稱 : {data.course_name}
//                     <br />
//                     課程科目: {data.course_subject}
//                     <br />
//                     年級:{data.grade}
//                     <br />
//                     </Link>

//                     </>
//                 )
//             })}

//         </div>
//         </>
//     )
// }
// export default CourseLists

'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { useParams } from 'next/navigation';
import TeacherNavber from '../_components/navbar';

interface Course {
  id: string;
  course_name: string;
  start_time: string;
  end_time: string;
  students: { id: string; name: string }[];
}

export default function TeacherCalendarPage() {
  const { data: session } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const param = useParams();
  const teacherId = param?.teacherId as string;

  useEffect(() => {
    const fetchCourses = async () => {
      if (!session?.user?.id) return;
      try {
        const response = await fetch(`/api/teacher/${session.user.id}/courses`);
        if (!response.ok) throw new Error('無法獲取課程數據');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('獲取課程失敗:', error);
      }
    };

    fetchCourses();
  }, [session]);

  return (
    
    <div className="container mx-auto p-4 bg-white border border-blue-200">
       <TeacherNavber  teacherId={teacherId} />         
      <h1 className="text-2xl font-bold text-blue-600 mb-4">教師課程表</h1>

      
      <div className="bg-white p-4 rounded-lg shadow-md">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          events={courses.map((course) => ({
            title: `${course.course_name} (${course.students.length} 名學生)`,
            start: course.start_time,
            end: course.end_time,
            classNames: ['bg-blue-100 text-blue-800', 'border-blue-200', 'hover:bg-blue-200', 'cursor-pointer'],
          }))}
          eventClick={(info) => {
            const course = courses.find((c) => c.course_name === info.event.title.split(' (')[0]);
            if (course) {
              alert(`學生名單: ${course.students.map((s) => s.name).join(', ')}`);
            }
          }}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay',
          }}
          eventContent={({ event }) => (
            <div className="p-1 text-blue-600">
              {event.title}
            </div>
          )}
          dayCellClassNames="border-blue-200"
          eventBorderColor="#bfdbfe"
          eventBackgroundColor="#dbeafe"
        />
      </div>
    </div>
  );
}
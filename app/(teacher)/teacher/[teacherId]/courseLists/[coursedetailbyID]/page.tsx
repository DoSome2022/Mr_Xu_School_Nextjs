// "use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";
// import { useParams } from "next/navigation";

// const CourseDetail = () => {
//     const params = useParams<{teacherId : string , coursedetailbyID : string}>();
//     const teacherId = params?.teacherId as string;
//     const courseId = params?.coursedetailbyID as string;
//     console.log("params : ",params)

//     const [ GetTeacherData , setGetTeacherData ] = useState([]);
    
//     useEffect(()=>{
//       if(teacherId){
//         const fetchTeacherData = async (id:string) => {
//           try {
//             const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
//             if (!response.ok) {
//               throw new Error("Failed to fetch teacher data");
//             }
//             const data = await response.json();
//             setGetTeacherData(data);
//           } catch (error) {
//             console.error("Errorfetching teacher data:", error);
//           }
//         }
//         fetchTeacherData(teacherId)
//       }
//     },[teacherId])

//     console.log("--teacher_data : --  ",GetTeacherData,"-- END --")
//     const CourseData = GetTeacherData[0]?.Course;


//     console.log("--CourseData : --  ",CourseData,"-- END --")


//     return(
//         <>
//             <span>CourseDetail</span>
//             <br />
//             {CourseData?.map((data:any)=>{
//                 return(
//                     <>
//                     課程名稱 : {data.course_name}
//                     <br />
//                     課程科目: {data.course_subject}
//                     <br />
//                     年級:{data.grade}
//                     <br />
//                     人數:{data.persons}
//                     <br />
//                     課堂:
//                         {data?.class.map((classData:any)=>{
//                             return(
//                               <>
//                               <br />
//                               <Link href={`/teacher/${teacherId}/courseLists/${courseId}/classLists/${classData.id}`}>
//                               名：{classData.title}
//                               </Link>
//                               <br />
//                               </>
//                             )
//                         })}
                        
            
//                     </>
//                 )
//             })}



//         </>
//     )
// }
// export default CourseDetail


"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Course, Class } from "@prisma/client";

// 定義教師數據結構
interface TeacherData {
  id: string;
  username: string;
  Course: (Course & { class: Class[] })[]; // 包含課程和班級關係
}

const CourseDetail = () => {
  const params = useParams<{ teacherId: string; coursedetailbyID: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();

  const teacherId = params?.teacherId as string;
  const courseId = params?.coursedetailbyID as string;

  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 身份驗證檢查
  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (session?.user.id !== teacherId) {
      setError("無權訪問此頁面");
    }
  }, [status, session, teacherId, router]);

  // 獲取教師數據
  useEffect(() => {
    if (teacherId && !error) {
      const fetchTeacherData = async (id: string) => {
        try {
          const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`, {
            cache: "no-store",
          });
          if (!response.ok) {
            throw new Error("無法獲取教師數據");
          }
          const data: TeacherData[] = await response.json();
          setTeacherData(data);
        } catch (error: any) {
          console.error("獲取教師數據失敗:", error.message);
          setError("無法載入教師數據，請稍後重試");
        }
      };
      fetchTeacherData(teacherId);
    }
  }, [teacherId, error]);

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        <span>CourseDetail</span>
        <br />
        {error}
      </div>
    );
  }

  const courseData = teacherData[0]?.Course.filter(
    (course) => course.id === courseId
  );

  if (!courseData || courseData.length === 0) {
    return (
      <div>
        <span>CourseDetail</span>
        <br />
        暫無課程數據
      </div>
    );
  }

  return (
    <>
      <span>CourseDetail</span>
      <br />
      {courseData.map((data) => (
        <div key={data.id}>
          課程名稱: {data.course_name}
          <br />
          課程科目: {data.course_subject}
          <br />
          年級: {data.grade}
          <br />
          人數: {data.persons}
          <br />
          課堂:
          {data.class.map((classData) => (
            <div key={classData.id}>
              <Link
                href={`/teacher/${teacherId}/courseLists/${courseId}/classLists/${classData.id}`}
              >
                名: {classData.title || "未命名課堂"}
              </Link>
              <br />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default CourseDetail;
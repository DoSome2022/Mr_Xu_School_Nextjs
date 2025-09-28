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
import TeacherNavber from "../../_components/navbar";

interface TeacherData {
  id: string;
  username: string;
  Course: (Course & { class: Class[] })[];
}

const CourseDetail = () => {
  const params = useParams<{ teacherId: string; coursedetailbyID: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();

  const teacherId = params?.teacherId as string;
  const courseId = params?.coursedetailbyID as string;

  const [teacherData, setTeacherData] = useState<TeacherData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated") {
      router.push("/stafflogin");
    } else if (session?.user.id !== teacherId) {
      setError("無權訪問此頁面");
    }
  }, [status, session, teacherId, router]);

  useEffect(() => {
    if (teacherId && !error) {
      const fetchTeacherData = async (id: string) => {
        try {
          const response = await fetch(`/api/Teacher_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
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
    return <div className="min-h-screen flex items-center justify-center text-gray-600">載入中...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAFC] text-red-500 p-4">
        <h1 className="text-2xl font-bold text-[#80A8BD] mb-4">課程詳情</h1>
        <p>{error}</p>
      </div>
    );
  }

  const courseData = teacherData[0]?.Course.filter((course) => course.id === courseId);

  if (!courseData || courseData.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7FAFC] text-gray-600 p-4">
        <TeacherNavber teacherId={teacherId} />
        <h1 className="text-2xl font-bold text-[#80A8BD] mb-4">課程詳情</h1>
        <p>暫無課程數據</p>
      </div>
    );
  }

  return (
    <>
    
    
    <TeacherNavber teacherId={teacherId} />
    <div className="min-h-screen flex bg-[#F7FAFC] pt-16 pl-64 md:pl-48 lg:pl-64">
              
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white shadow-lg rounded-md p-6">
          <h1 className="text-2xl font-bold text-[#80A8BD] mb-6">課程詳情</h1>
          {courseData.map((data) => (
            <div key={data.id} className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">課程名稱: {data.course_name}</h2>
                <p className="text-gray-600">課程科目: {data.course_subject}</p>
                <p className="text-gray-600">年級: {data.grade}</p>
                <p className="text-gray-600">人數: {data.persons}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">課堂</h3>
                {data.class.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-2">
                    {data.class.map((classData) => (
                      <li key={classData.id}>
                        <Link
                          href={`/teacher/${teacherId}/courseLists/${courseId}/classLists/${classData.id}`}
                          className="text-[#80A8BD] hover:text-[#6B8FA3] transition-colors duration-300"
                        >
                          {classData.title || "未命名課堂"}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">無課堂數據</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    </>
  );
};

export default CourseDetail;
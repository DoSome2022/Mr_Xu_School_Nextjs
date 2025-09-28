// "use client";

// import { Logout_Button } from "@/components/logout_button";
// import { useSession } from "next-auth/react";
// import TeacherNavber from "../_components/navbar";
// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// const StudentLists = () => {
//   const param = useParams();
//   const teacherId = param?.teacherId as string;
//   console.log(" teacherId :",teacherId);
//   const [getteacherData , setgetteacherData] = useState([]);

//     useEffect(() => {
//       const fetchstudentLists = async (id:string) => {
//         const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`);
//         if (!res) {
//           throw new Error("斷線！");
//         }
//         const result = await res.json();
//         setgetteacherData(result);
//       }
//       fetchstudentLists(teacherId);
//     },[teacherId])

//     console.log(" getteacherData : ",getteacherData);

//     const studentLists = getteacherData[0]?.Student;

//     console.log(" Student : ", studentLists)
  
//     return (
//       <div className="container mx-auto h-full w-full bg-blue-200 p-4">
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-1">

//       {studentLists?.map((d:any)=>{
//         return(
//           <>
//          <Link href={`/teacher/${teacherId}/studentLists/${d.id}`}>
//            姓名:{d.name}
         
//          </Link>
//           </>
//         )
//       })}


//       </div>
//     </div>
//       );
// }
// export default StudentLists


"use client";

import TeacherNavber from "../_components/navbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { TeacherData, Student } from "@/types/teacher";

const StudentLists = () => {
  const param = useParams();
  const teacherId = param?.teacherId as string;
 const [getteacherData, setGetteacherData] = useState<TeacherData | null>(null);

  useEffect(() => {
    const fetchstudentLists = async (id: string) => {
      try {
        const res = await fetch(`/api/Teacher_detail_data_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
        if (!res.ok) {
          throw new Error("無法獲取學生數據");
        }
        const result = await res.json();
        setGetteacherData(result);
      } catch (error) {
        console.error("獲取學生數據失敗:", error);
      }
    };
    if (teacherId) {
      fetchstudentLists(teacherId);
    }
  }, [teacherId]);

  const studentLists: Student[] = getteacherData?.Student || [];

  return (
    <div className="container mx-auto p-4 bg-[#80A8BD] border border-blue-200 min-h-screen">
      <TeacherNavber teacherId={teacherId} />
      <h1 className="text-2xl font-bold text-blue-600 mb-4">學生列表</h1>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {studentLists.length > 0 ? (
          studentLists.map((student) => (
            <Link
              key={student.id}
              href={`/teacher/${teacherId}/studentLists/${student.id}`}
              className="block p-4 bg-[#80A8BD] border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-200 transition-colors text-lg"
            >
              <div className="font-medium">姓名: {student.name}</div>
            </Link>
          ))
        ) : (
          <p className="text-blue-600 text-lg">暫無學生數據</p>
        )}
      </div>
    </div>
  );
};

export default StudentLists;
// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useEffect, useState } from 'react';

// interface StudentData {
//     id: string;
//     name: string;
//     grade: number;
//     quarter: number;
//     year: string;
//     subject: string;
// }

// const ScoreLists_Year_Quarter_Subject_List = () => {
//     const params = useParams<{parentId : string ; studentid : string ;  grade : string ; year: string; quarter:string; subject: string;}>();
//     const ParentID = params?.parentId as string;
//     const StudentID = params?.studentid as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';

//     const [ GetStudentScoreLists , setGetStudentScoreLists ] = useState<StudentData[]>([]);

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentscorelists = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`, {
//                 cache: 'no-store',  // 強制不快取，確保每次請求新數據
//                 headers: {
//                     'Cache-Control': 'no-cache',
//                 },
//             })
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentScoreLists(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentscorelists(StudentID)
//         }
//     },[StudentID])


//     console.log(GetStudentScoreLists[0])


//     return(
//         <>
//             <span> ScoreLists_Year_Quarter_Subject_List </span>
//             <br />
//             {GetStudentScoreLists.map((d )=>{
//                 if(d.grade == Number(Grade) && d.year == Year && d.quarter == Number(Quarter) && d.subject == SubjectId){

//                     return(
//                         <div key={d.id}>
//                 <br />
//                     <Link className="text-stone-950 hover:text-gray-700" 
//                         href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${Year}/${Quarter}/${SubjectId}/${d.id}`}
//                     >
//                         名稱: {d.name}
//                     </Link>
//                 <br />
//                         </div>
//                     )
//                 }
//             })}
//         </>
//     )
// }

// export default ScoreLists_Year_Quarter_Subject_List

"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  quarter: number;
  year: string;
  subject: string;
}

const ScoreLists_Year_Quarter_Subject_List = () => {
  const params = useParams<{
    parentId: string;
    studentid: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const ParentID = params?.parentId as string;
  const StudentID = params?.studentid as string;
  const Grade = params?.grade as string;
  const Year = params?.year as string;
  const Quarter = params?.quarter as string;
  const SubjectId = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!ParentID || !StudentID || !Grade || !Year || !Quarter || !SubjectId) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetStudentScoreLists, setGetStudentScoreLists] = useState<StudentData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (StudentID) {
      const getstudentscorelists = async (studentId: string) => {
        try {
          const res = await fetch(`/api/student/Student_Score_by_id_Lists/${studentId}`, {
            cache: "no-store",
            headers: {
              "Cache-Control": "no-cache",
            },
          });
          if (!res.ok) {
            throw new Error(`無法連線：${res.statusText}`);
          }
          const result = await res.json();
          if (!Array.isArray(result)) {
            throw new Error("無效的資料格式");
          }
          setGetStudentScoreLists(result);
        } catch (error) {
          console.error("獲取成績列表失敗:", error);
          setError("無法載入成績列表，請稍後重試");
          toast.error("無法載入成績列表，請稍後重試");
        }
      };
      getstudentscorelists(StudentID);
    }
  }, [StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("params:", params);
    console.log("GetStudentScoreLists:", GetStudentScoreLists, "-- END --");
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      {/* 麵包屑導航，採用 navbar 風格 */}
      <nav className="flex items-center justify-between bg-gray-900 p-4 shadow-md">
        <div className="flex flex-row gap-6">
          <Link
            href={`/parent/${ParentID}`}
            prefetch={false} // 禁用預取以避免 404
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            苜頁
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            學生資料
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            成績列表
          </Link>
          <Link
            href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${Year}/${Quarter}/${encodeURIComponent(SubjectId)}`}
            prefetch={false}
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200"
          >
            {Year} {Grade} 第{Quarter}季 {SubjectId}
          </Link>
          <span className="text-white text-lg font-medium">成績列表詳情</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          成績列表 - {Year} {Grade} 第{Quarter}季 {SubjectId}
        </h2>

        <div className="bg-gray-700 p-6 rounded-lg shadow-md">
          {error ? (
            <div className="text-red-400 p-4 rounded-lg bg-red-900 bg-opacity-20">
              {error}
            </div>
          ) : GetStudentScoreLists.length === 0 ? (
            <div className="text-gray-300 p-4">無成績列表資料</div>
          ) : (
            <div className="space-y-4">
              {GetStudentScoreLists.map((d) => {
                if (
                  d.grade === Number(Grade) &&
                  d.year === Year &&
                  d.quarter === Number(Quarter) &&
                  d.subject === SubjectId
                ) {
                  return (
                    <div key={d.id}>
                      <Link
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${Year}/${Quarter}/${encodeURIComponent(SubjectId)}/${d.id}`}
                        prefetch={false}
                        className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-200 block mb-2"
                      >
                        名稱: {d.name}
                      </Link>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreLists_Year_Quarter_Subject_List;
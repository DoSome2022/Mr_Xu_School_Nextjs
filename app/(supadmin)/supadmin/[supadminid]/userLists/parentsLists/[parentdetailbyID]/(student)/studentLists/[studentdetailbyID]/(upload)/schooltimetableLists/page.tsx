// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface StudentSchool {
//   school:string
// }
// const SchoolTimeTableListsbysupadmin = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string; supadminId: string;}>();
//     const ParentId = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const supadminId = params?.supadminId as string;


//                   //拿學生資料
//                   const [GetSutudentData , setGetSutudentData] = useState<StudentSchool[]>([]);
    
//                   //用ParentId去拿student DB裹的DATA
//                   useEffect(()=>{
//                     if(ParentId){
//                       const fetchStudentData = async (parentdataid : string) => {
//                         //在app/api/student/Student_Lists/[id]/route.ts
//                         const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
//                         if(!res){
//                           throw new Error("斷線！")
//                         }
//                         const result = await res.json();
//                         setGetSutudentData(result);
//                       }
//                       fetchStudentData(ParentId)
//                     }
//                   },[ParentId])
              
              
//                   console.log("-- Student Data : --",GetSutudentData,"-- END --")

//     return(
//         <>
//             <span> SchoolTimeTableLists </span>
//             <br />
//             <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/upload`}
//                 >
//                         上傳學校時間表
//                     </Link>
//                 <br />
//             {GetSutudentData.map((d)=>{
//                 return(
//                     <>
//                     <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/${d.school}`}
//                 >
                    
//                         school: {d.school}
//                     </Link>
                    
//                     </>
//                 )
                
//             })}

//             <br />
//         </>
//     )
// }

// export default SchoolTimeTableListsbysupadmin

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

interface StudentSchool {
  id: string;
  school: string;
}

const SchoolTimeTableListsbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentId = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  // 驗證路由參數
  if (!supadminId || !ParentId || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentSchool[]> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_Lists/${ParentId}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入學生資料 - {error.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 資料格式驗證
  if (
    !data ||
    !Array.isArray(data) ||
    !data.every((item) => typeof item.id === "string" && typeof item.school === "string")
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學生資料格式
      </div>
    );
  }

  // 過濾與 StudentID 匹配的學生資料
  const filteredStudentData = data.filter((d) => d.id === StudentID);

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <span>學校時間表</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">學校時間表列表</h2>

      <div className="flex flex-col space-y-4">
        <Link
          className="text-blue-600 hover:text-blue-800 font-medium"
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/upload`}
        >
          上傳學校時間表
        </Link>

        {filteredStudentData.length === 0 && (
          <div className="text-gray-600 p-4">無學校資料</div>
        )}

        {filteredStudentData.map((d) => (
          <Link
            key={d.id}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(d.school)}`}
          >
            {d.school}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SchoolTimeTableListsbysupadmin;
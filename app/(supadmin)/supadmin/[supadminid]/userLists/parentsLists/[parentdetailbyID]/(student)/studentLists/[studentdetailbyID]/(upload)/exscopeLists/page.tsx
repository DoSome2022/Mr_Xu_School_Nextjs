// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface Student_School{
//   school:string;
// }

// const ExScopebysupadmin = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string; supadminid: string}>();
//     const ParentId = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const supadminId = params?.supadminid as string;

//            //拿學生資料
//     const [GetSutudentData , setGetSutudentData] = useState<Student_School[]>([]);
    
//     //用ParentId去拿student DB裹的DATA
//     useEffect(()=>{
//       if(ParentId){
//         const fetchStudentData = async (parentdataid : string) => {
//           //在app/api/student/Student_Lists/[id]/route.ts
//           const res = await fetch(`/api/student/Student_Lists/${parentdataid}`);
//           if(!res){
//             throw new Error("斷線！")
//           }
//           const result = await res.json();
//           setGetSutudentData(result);
//         }
//         fetchStudentData(ParentId)
//       }
//     },[ParentId])

//     console.log("-- Student Data : --",GetSutudentData,"-- END --")

//     return(
//         <>
//             <span> ExScope </span>
//             <br />

//             <Link
//                     className="text-stone-950 hover:text-gray-700"
//                   href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/upload`}
//                 >
                    
//                         上傳考試範圍
//                     </Link>
//             <br />
//             {GetSutudentData.map((d)=>{
//                 return(
//                 <>
//                     <br />
//                     <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/${d.school}`}
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

// export default ExScopebysupadmin


"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Student_School {
  school: string;
}

const ExScopebysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentId = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  console.log("params : ", params , "-- END --" )
  console.log("parentId : ", ParentId ,"-- END --")

  // 驗證路由參數
  if (!supadminId || !ParentId || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const [GetSutudentData, setGetSutudentData] = useState<Student_School[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStudentData = async (parentId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://localhost:3000";
        const res = await fetch(
          `${apiUrl}/api/student/Student_Lists/${parentId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            }
        );
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (!Array.isArray(result)) {
          throw new Error("無效的學生資料格式");
        }
        if (!result.every((item) => typeof item.school === "string")) {
          throw new Error("無效的學校資料格式");
        }
        setGetSutudentData(result);
      } catch (err: any) {
        setError(err.message || "無法獲取學生資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (ParentId) {
      fetchStudentData(ParentId);
    }
  }, [ParentId, StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("-- Student Data : --", GetSutudentData, "-- END --");
  }

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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <span>考試範圍</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">考試範圍管理</h2>

      <Link
        className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-block"
        href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/upload`}
      >
        上傳考試範圍
      </Link>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}
      {/* {!isLoading && !error && GetSutudentData.length === 0 && (
        <div className="text-gray-600 p-4">無學校資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {GetSutudentData.map((d) => (
          <Link
            key={d.school}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/${d.school}`}
          >
            學校：{d.school}
          </Link>
        ))}
      </div> */}
            {GetSutudentData.length > 0 ? (
        <div className="space-y-4">
          <Link
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/upload`}
            className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
          >
            上傳考試範圍
          </Link>
          {GetSutudentData.map((d) => (
            <div key={d.school} className="border border-gray-200 rounded p-4 bg-white shadow-sm">
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/exscopeLists/${d.school}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                學校: {d.school}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無學校資料</p>
      )}
    </div>
  );
};

export default ExScopebysupadmin;
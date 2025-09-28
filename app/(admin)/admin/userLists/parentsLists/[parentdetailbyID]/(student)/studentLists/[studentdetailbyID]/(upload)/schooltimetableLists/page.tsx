// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from "react";
// import Link from "next/link";

// interface StudentSchool {
//   school:string
// }
// const SchoolTimeTableLists = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string}>();
//     const ParentId = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;

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
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/upload`}
//                 >
//                         上傳學校時間表
//                     </Link>
//                 <br />
//             {GetSutudentData.map((d)=>{
//                 return(
//                     <>
//                     <Link
//                     className="text-stone-950 hover:text-gray-700"
//                     href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/${d.school}`}
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

// export default SchoolTimeTableLists

"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface StudentSchool {
  school: string;
}

const SchoolTimeTableLists = () => {
  const params = useParams<{parentdetailbyID: string; studentdetailbyID: string}>();
  const ParentId = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;

  const [GetStudentData, setGetStudentData] = useState<StudentSchool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (ParentId) {
      const fetchStudentData = async (parentdataid: string) => {
        try {
          setIsLoading(true);
          const res = await fetch(`/api/student/Student_Lists/${parentdataid}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
          if (!res.ok) {
            throw new Error("獲取資料失敗！");
          }
          const result = await res.json();
          setGetStudentData(result);
        } catch (error) {
          console.error(error);
          setError(error instanceof Error ? error.message : "發生未知錯誤");
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudentData(ParentId);
    }
  }, [ParentId]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentId}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <span>學校時間表</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 標題欄 - 使用與 navbar 相同的配色 */}
          <div className="bg-[#80A8BD] px-6 py-4">
            <h1 className="text-xl font-bold text-white">學校時間表管理</h1>
          </div>

          {/* 內容區域 */}
          <div className="p-6">
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
                <p className="mt-4 text-gray-600">資料載入中...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700">{error}</span>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* 上傳按鈕 */}
                <Link
                  href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/upload`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#80A8BD] hover:bg-[#d6824a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#80A8BD] transition-colors duration-300"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  上傳學校時間表
                </Link>

                {/* 學校列表 */}
                {GetStudentData.length > 0 ? (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-gray-900">選擇學校</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {GetStudentData.map((d) => (
                        <Link
                          key={d.school}
                          href={`/admin/userLists/parentsLists/${ParentId}/studentLists/${StudentID}/schooltimetableLists/${d.school}`}
                          className="group block p-4 border border-gray-200 rounded-lg hover:border-[#80A8BD] hover:bg-[#f8e5d8] transition-colors duration-300"
                        >
                          <div className="flex items-center">
                            <svg className="h-6 w-6 text-[#80A8BD] mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="text-gray-800 group-hover:text-[#80A8BD] transition-colors duration-300">{d.school}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    目前沒有學校資料
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchoolTimeTableLists;
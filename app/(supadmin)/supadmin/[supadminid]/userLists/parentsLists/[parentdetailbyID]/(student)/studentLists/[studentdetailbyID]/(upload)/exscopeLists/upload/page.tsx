// "use client";

// import Student_EX_Scope_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-EX-Scope-Create-Form";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface GetStudentData {
//     id: string;
//     name: string;
//     grade: number;
//     school: string;
// }
// const Student_ExscopeLists_uploadbysupadmin = () =>{

//     const params = useParams();
//     console.log(params)
//     const StudentID = params?.studentdetailbyID as string;

//     const [ GetStudentData , setGetStudentData ] = useState<GetStudentData[]>([]);

//     useEffect(() => {
//         if(StudentID){
//             const fetchStudentData = async (StudentID: string) => {
//                 const res = await fetch(`/api/student/Student_Lists_detail_data_by_id/${StudentID}`)
//                 if(!res.ok){
//                     throw new Error("斷線！")
//                 }
//                 const result = await res.json();
//                 setGetStudentData(result);

//             } 
//             fetchStudentData(StudentID)
//         }
//     },[StudentID])

//     if (!StudentID) {
//         return <div className="p-4 text-red-500">無效的學生 ID</div>;
//       }
    
    
//       if (!GetStudentData) {
//         return <div className="p-4">載入中...</div>;
//       }



//     return(
//         <>
//             <Student_EX_Scope_Create_Formbysupadmin studentId={StudentID} data={GetStudentData} />
//         </>
//     )
    
// }

// export default Student_ExscopeLists_uploadbysupadmin


"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Student_EX_Scope_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-EX-Scope-Create-Form";

interface GetStudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const Student_ExscopeLists_uploadbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  const [GetStudentData, setGetStudentData] = useState<GetStudentData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-lg">錯誤：缺少必要路由參數</div>;
  }

  useEffect(() => {
    const fetchStudentData = async (studentId: string) => {
      try {
        setIsLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";
        const res = await fetch(`${apiUrl}/api/student/Student_Lists_detail_data_by_id/${studentId}`);
        if (!res.ok) {
          throw new Error(`請求失敗：${res.statusText}`);
        }
        const result = await res.json();
        if (
          !Array.isArray(result) ||
          !result.every(
            (item) =>
              typeof item.id === "string" &&
              typeof item.name === "string" &&
              typeof item.school === "string" &&
              typeof item.grade === "number"
          )
        ) {
          throw new Error("無效的學生資料格式");
        }
        setGetStudentData(result);
      } catch (err: any) {
        setError(err.message || "無法獲取學生資料");
      } finally {
        setIsLoading(false);
      }
    };

    if (StudentID) {
      fetchStudentData(StudentID);
    }
  }, [StudentID]);

  // 開發環境日誌
  if (process.env.NODE_ENV === "development") {
    console.log("-- Student Data : --", GetStudentData, "-- END --");
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <span>上傳考試範圍</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">上傳學生考試範圍</h2>

      {isLoading && <div className="text-gray-600 p-4">載入中...</div>}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">{error}</div>
      )}
      {!isLoading && !error && GetStudentData.length === 0 && (
        <div className="text-gray-600 p-4">無學生資料</div>
      )}
      {!isLoading && !error && GetStudentData.length > 0 && (
        <Student_EX_Scope_Create_Formbysupadmin studentId={StudentID} data={GetStudentData} />
      )}
    </div>
  );
};

export default Student_ExscopeLists_uploadbysupadmin;
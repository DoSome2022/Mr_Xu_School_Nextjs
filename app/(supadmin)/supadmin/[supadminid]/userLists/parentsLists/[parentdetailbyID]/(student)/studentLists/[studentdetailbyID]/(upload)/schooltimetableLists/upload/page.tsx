// "use client";

// import Student_SchoolTimeTable_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-SchoolTimeTable-Create-Form";
// import { useParams } from "next/navigation";
// import { useEffect, useState } from "react";

// interface StudentData {
//     id: string;
//     name: string;
//     grade: number;
//     school: string;
// }

// const Student_SchoolTimeTable_uploadbysupadmin = () =>{
//     const params = useParams();
//     console.log(params)
//     const StudentID = params?.studentdetailbyID as string;
//     const [ GetStudentData , setGetStudentData ] = useState<StudentData[]>([]);

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


//     return(
//         <>
// <Student_SchoolTimeTable_Create_Formbysupadmin studentId={StudentID} data={GetStudentData}/>
//         </>
//     )
    
// }

// export default Student_SchoolTimeTable_uploadbysupadmin


"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import Student_SchoolTimeTable_Create_Formbysupadmin from "@/components/CreateForm/SUPADMIN/UploadForm/student/Sup-Student-SchoolTimeTable-Create-Form";

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const Student_SchoolTimeTable_uploadbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentData[]> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_Lists_detail_data_by_id/${StudentID}`,
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
  if (!data || !Array.isArray(data) || !data.every((item) => item.id && item.name && item.grade && item.school)) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學生資料格式
      </div>
    );
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
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <span>上傳學校時間表</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">上傳學生學校時間表</h2>

      <Student_SchoolTimeTable_Create_Formbysupadmin studentId={StudentID} data={data} />
    </div>
  );
};

export default Student_SchoolTimeTable_uploadbysupadmin;
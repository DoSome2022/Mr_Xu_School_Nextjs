// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useEffect, useState } from 'react';

// interface StudentSchoolName {
//     name:string;
//     id:string;
//     school:string;
//     grade:string;
//     year:string;
//     quarter:string;
//     subject:string;
// }
// const ExTimeLists_Grade_Year_Quarter_subject_Listsbysupadmin = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string; quarter:string; subject: string; supadminId:string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
//     const supadminId = params?.supadminId as string;


//     const [ GetStudentExTimeLists , setGetStudentExTimeLists ] = useState<StudentSchoolName[]>([]);

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentextimelist = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ExTime_by_id_Lists/${StudentID}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExTimeLists(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentextimelist(StudentID)
//         }
//     },[StudentID])


//     console.log(GetStudentExTimeLists[0])

//     return(
//         <>
//             <span> ExTimeLists_Grade_Year_Quarter_subject_Lists </span>
//             <br />
//             {GetStudentExTimeLists.map((d)=>{
//                 if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
//                 >
//                     名稱: {d.name}
//                 </Link>
//             <br />
//                     </>
//                 )

//                 }

//             })}
//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_subject_Listsbysupadmin

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

interface StudentSchoolName {
  id: string;
  name: string;
  school: string;
  grade: string; // 若 API 返回數字，需改為 number
  year: string;
  quarter: string;
  subject: string;
}

const ExTimeLists_Grade_Year_Quarter_subject_Listsbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolName[]> =>
    fetch(url, {
    ...init, // 保留傳入的 init 配置（若有）
    cache: 'no-store', // 強制不快取，確保每次請求新數據
    headers: {
      ...init?.headers, // 合併傳入的 headers（若有）
      'Cache-Control': 'no-cache', // 設置快取控制頭部
    },
  }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_ExTime_by_id_Lists/${StudentID}?school=${encodeURIComponent(SchoolName)}&grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(Quarter)}&subject=${encodeURIComponent(Subject)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入考試時間表資料 - {error.message || "未知錯誤"}
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
    !data.every(
      (item) =>
        typeof item.name === "string" &&
        typeof item.id === "string" &&
        typeof item.school === "string" &&
        typeof item.grade === "string" &&
        typeof item.year === "string" &&
        typeof item.quarter === "string" &&
        typeof item.subject === "string"
    )
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的考試時間表資料格式
      </div>
    );
  }

  // 過濾數據
  const filteredExTimeLists = data.filter(
    (d) =>
      d.school === SchoolName &&
      d.grade === Grade &&
      d.year === Year &&
      d.quarter === Quarter &&
      d.subject === Subject
  );

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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {Quarter}
        </Link>
        <span className="mx-2">/</span>
        <span>{Subject}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} 年級 {Grade} {Year} 季度 {Quarter} {Subject} 考試時間表列表
      </h2>

      {filteredExTimeLists.length === 0 && (
        <div className="text-gray-600 p-4">無考試時間表資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {filteredExTimeLists.map((d) => (
          <Link
            key={d.id}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(Subject)}/${d.id}`}
          >
            {d.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExTimeLists_Grade_Year_Quarter_subject_Listsbysupadmin;
// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import { useEffect, useState } from 'react';

// interface StudentName {
//     id:string;
//     name:string;
//     grade:string;
//     year:string;
//     quarter:string;
//     subject:string;
// }
// const ScoreLists_Year_Quarter_Subject_ListbySupadmin = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string ; year: string; quarter:string; subject: string;supadminId: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
//     const supadminId = params?.supadminId as string;


//     const [ GetStudentScoreLists , setGetStudentScoreLists ] = useState<StudentName[]>([]);

//     console.log("params : ", params )

//     useEffect(()=>{
//         if(StudentID){
//             const getstudentscorelists = async (StudentID: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_Score_by_id_Lists/${StudentID}`)
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
//             {GetStudentScoreLists.map((d)=>{
//                 if(d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${Quarter}/${Subject}/${d.id}`}
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

// export default ScoreLists_Year_Quarter_Subject_ListbySupadmin

"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

// 定義年級對應對象（從 ScoreListsbysupadmin 借用）
const gradeMapping: { [key: string]: string } = {
  "1": "小學1年級",
  "2": "小學2年級",
  "3": "小學3年級",
  "4": "小學4年級",
  "5": "小學5年級",
  "6": "小學6年級",
  "7": "初中1年級",
  "8": "初中2年級",
  "9": "初中3年級",
  "10": "高中1年級",
  "11": "高中2年級",
  "12": "高中3年級",
};

// 定義季度對應對象（從 ScoreLists_Year_Quarterbysupadmin 借用）
const quarterMapping: { [key: string]: string } = {
  "1": "第一季度",
  "2": "第二季度",
  "3": "第三季度",
  "4": "第四季度",
};

interface StudentName {
  id: string;
  name: string;
  grade: string;
  year: string;
  quarter: string;
  subject: string;
}

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const ScoreLists_Year_Quarter_Subject_ListbySupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !Grade || !Year || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  // 驗證年級是否有效
  if (!gradeMapping[Grade]) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無效的年級 {Grade}
      </div>
    );
  }

  // 驗證季度是否有效
  if (!quarterMapping[Quarter]) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無效的季度 {Quarter}
      </div>
    );
  }

  const fetcher = <T,>(url: string, init?: RequestInit): Promise<T> =>
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

    // const apiUrl_DJANGO = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const apiUrl_NEXTJS = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";

  // 獲取成績資料
  const { data: scoreData, error: scoreError, isLoading: scoreLoading } = useSWR<StudentName[]>(
    `${apiUrl_NEXTJS}/api/student/Student_Score_by_id_Lists/${StudentID}?grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(Quarter)}&subject=${encodeURIComponent(Subject)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 獲取學生資料以顯示名稱
  const { data: studentData, error: studentError, isLoading: studentLoading } = useSWR<StudentData[]>(
    `${apiUrl_NEXTJS}/api/student/Student_Lists_detail_data_by_id/${StudentID}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (scoreError || studentError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(scoreError || studentError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (scoreLoading || studentLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證成績資料
  if (
    !scoreData ||
    !Array.isArray(scoreData) ||
    !scoreData.every((item) => item.id && item.name && item.grade && item.year && item.quarter && item.subject)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的成績資料格式
      </div>
    );
  }

  // 驗證學生資料
  if (
    !studentData ||
    !Array.isArray(studentData) ||
    studentData.length === 0 ||
    !studentData.every((item) => item.id && item.name && typeof item.grade === "number" && item.school)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學生資料格式
      </div>
    );
  }

  // 過濾成績資料
  const filteredScores = scoreData.filter(
    (d) => d.grade === Grade && d.year === Year && d.quarter === Quarter && d.subject === Subject
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          成績表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {gradeMapping[Grade]}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {quarterMapping[Quarter]}
        </Link>
        <span className="mx-2">/</span>
        <span>{Subject}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {studentData[0].name} 的 {gradeMapping[Grade]} {Year} {quarterMapping[Quarter]} {Subject} 成績表列表
      </h2>

      {filteredScores.length === 0 && <div className="text-gray-600 p-4">無成績表資料</div>}

      <div className="flex flex-col space-y-4">
        {filteredScores.map((score) => (
          <Link
            key={score.id}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(Subject)}/${encodeURIComponent(score.id)}`}
          >
            成績表 {score.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScoreLists_Year_Quarter_Subject_ListbySupadmin;
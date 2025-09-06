// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface StudentDetailData {
//     name: string;
//     img: string;
//     id: string;
//     school: string;
//     grade: string;
//     year: string;
//     quarter: string;
// }

// const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin = () => {
//     const params = useParams<{ studentdetailbyID : string ; id : string ; parentdetailbyID: string; school : string; grade : string ; year: string; quarter: string;}>();
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Id = params?.id as string;


//     const [ GetStudentSchoolTimeTableDetailByID , setGetStudentSchoolTimeTableDetailByID ] = useState<StudentDetailData[]>([]);

//     useEffect(()=>{
//         if(StudentID && Id){
//             const getstudentschooltimetabledetailbyid = async (StudentID: string , id: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ScTimetable_by_id_Lists_by_id/${StudentID}/${id}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentSchoolTimeTableDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentschooltimetabledetailbyid(StudentID , Id)
//         }
//     },[StudentID , Id])


//     console.log(GetStudentSchoolTimeTableDetailByID)


//     return(
//         <>
//             <span> SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_ID </span>
//             <br />
// {GetStudentSchoolTimeTableDetailByID.map((d)=>{
//     if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter){
//     return(
//         <>
//         {d.name}
//         <br />
//         <Image 
//                     width={500}
//                     height={500}
//                     src={d.img}
//                     alt=""
//                     />
//         </>
//     )        
//     }

// })}
//         </>
//     )
// }

// export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin



"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

interface StudentDetailData {
  name: string;
  img: string;
  id: string;
  school: string;
  grade: string;
  year: string;
  quarter: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    id: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Id = params?.id ? decodeURIComponent(params.id) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter || !Id) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentDetailData> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_ScTimetable_by_id_Lists_by_id/${StudentID}/${encodeURIComponent(Id)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入時間表資料 - {error.message || "未知錯誤"}
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
    typeof data !== "object" ||
    !data.name ||
    !data.img ||
    !data.id ||
    !data.school ||
    !data.grade ||
    !data.year ||
    !data.quarter
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的時間表資料格式
      </div>
    );
  }

  // 驗證數據是否匹配路由參數
  if (
    data.school !== SchoolName ||
    data.grade !== Grade ||
    data.year !== Year ||
    data.quarter !== Quarter ||
    data.id !== Id
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：時間表資料與路由參數不匹配
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}`}
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學年 {Year}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          季度 {Quarter}
        </Link>
        <span className="mx-2">/</span>
        <span>{data.name}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} 年級 {Grade} 學年 {Year} 季度 {Quarter} 時間表詳情
      </h2>

      <div className="flex flex-col space-y-4">
        <div className="text-lg font-medium text-blue-600">{data.name}</div>
        <Image
          width={500}
          height={500}
          src={`${apiUrl}${data.img}`}
          alt={data.name}
          className="object-contain rounded-lg"
        />
      </div>
    </div>
  );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Lists_By_IDbysupadmin;
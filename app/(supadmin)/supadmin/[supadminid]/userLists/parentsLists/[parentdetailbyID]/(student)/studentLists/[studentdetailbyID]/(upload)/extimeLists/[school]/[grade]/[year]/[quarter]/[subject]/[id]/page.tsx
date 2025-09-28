// "use client";

// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface StudentDetailData{
//     name:string;
//     img:string;
//     id:string;
//     school:string;
//     grade:string;
//     year:string;
//     quarter:string;
//     subject:string;
// }
// const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin = () => {
//     const params = useParams<{ studentdetailbyID : string ; id: string; school : string; grade : string; year: string; quarter:string; subject:string}>();
//     const Id = params?.id as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;
//     const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

//     const [ GetStudentExTimeDetailByID , setGetStudentExTimeDetailByID ] = useState<StudentDetailData[]>([]);

//     useEffect(()=>{
//         if(StudentID && Id){
//             const getstudentextimedetailbyid = async (StudentID: string , id: string) => {
//                 try {
//                     const res = await fetch(`/api/student/Student_ExTime_by_id_Lists_by_id/${StudentID}/${id}`)
//                     if(!res.ok) {
//                         throw new Error("斷線！");
//                     }
//                     const result = await res.json();
//                     setGetStudentExTimeDetailByID(result);                    
//                 } catch (error) {
//                     console.error(error)
//                 }
//             };
//             getstudentextimedetailbyid(StudentID,Id)
//         }
//     },[StudentID , Id])


//     console.log(GetStudentExTimeDetailByID)

//     return(
//         <>
//             <span> ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID </span>
//             <br />
// {GetStudentExTimeDetailByID.map((d)=>{
//     if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
//         return(
//             <>
//             {d.name}
//             <br />
//             <Image 
//                         width={500}
//                         height={500}
//                         src={d.img}
//                         alt=""
//                         />
//             </>
//         )
//     }
// })}
//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin


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
  grade: string; // 若 API 返回數字，改為 number
  year: string;
  quarter: string;
  subject: string;
}

const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    studentdetailbyID: string;
    parentdetailbyID: string;
    id: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const Id = params?.id;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";
  const Subject = params?.subject ? decodeURIComponent(params.subject) : "";

  // 驗證路由參數
  if (!supadminId || !StudentID || !Id || !SchoolName || !Grade || !Year || !Quarter || !Subject) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentDetailData> =>
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

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_ExTime_by_id_Lists_by_id/${StudentID}/${Id}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入考試時間表詳細資料 - {error.message || "未知錯誤"}
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
    typeof data.name !== "string" ||
    typeof data.img !== "string" ||
    typeof data.id !== "string" ||
    typeof data.school !== "string" ||
    typeof data.grade !== "string" ||
    typeof data.year !== "string" ||
    typeof data.quarter !== "string" ||
    typeof data.subject !== "string"
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的考試時間表詳細資料格式
      </div>
    );
  }

  // 驗證數據是否匹配路由參數
  if (
    data.school !== SchoolName ||
    data.grade !== Grade ||
    data.year !== Year ||
    data.quarter !== Quarter ||
    data.subject !== Subject
  ) {
    return <div className="text-gray-600 p-4">無匹配的考試時間表資料</div>;
  }

    // 下載圖片的功能
  const handleDownload = async (imgUrl: string, fileName: string) => {
    try {
    //   const response = await fetch(imgUrl, { mode: "cors" });
    const response = await fetch(`/api/proxy-image?img=${encodeURIComponent(imgUrl)}`);
      if (!response.ok) {
        throw new Error("無法下載圖片");
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName || "booklist-image.jpg"; // 使用書單名稱或默認文件名
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("下載圖片失敗:", error);
      alert("下載圖片失敗，請稍後再試");
    }
  };

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
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(Subject)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {Subject}
        </Link>
        <span className="mx-2">/</span>
        <span>{data.name}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} 年級 {Grade} {Year} 季度 {Quarter} {Subject} 考試時間表詳情
      </h2>

      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center space-y-4">
        <h3 className="text-xl font-semibold text-blue-600">{data.name}</h3>
        <Image
          width={500}
          height={500}
          src={data.img}
          alt={data.name}
          className="w-full max-w-md rounded-lg"
        />
      </div>
      <button
      onClick={() => handleDownload(data.img, `${data.name}.jpg`)}
      className="mt-4 inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
      >
      下載圖片
      </button>
    </div>
  );
};

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin;
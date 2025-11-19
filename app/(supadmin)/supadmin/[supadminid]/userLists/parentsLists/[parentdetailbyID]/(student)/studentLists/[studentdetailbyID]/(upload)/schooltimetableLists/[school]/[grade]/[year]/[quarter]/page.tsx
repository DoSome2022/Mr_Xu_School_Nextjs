"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";
import { toast } from "sonner";

interface StudentSchoolName {
  id: string;
  name: string;
  school: string;
  grade: string | number;
  year: string;
  quarter: string | number;
  student_name: string;
  student_school_timetable_id: string;
  img: string;
  craetedAt: string;
  updatedAt: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Listsbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
    year: string;
    quarter: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
  const Year = params?.year ? decodeURIComponent(params.year) : "";
  const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter) {
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
        <svg
          className="h-5 w-5 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolName[]> =>
    fetch(url, {
      ...init,
      cache: "no-store",
      headers: {
        ...init?.headers,
        "Cache-Control": "no-cache",
      },
    }).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/student/Student_ScTimetable_by_id_Lists/${StudentID}?school=${encodeURIComponent(
      SchoolName
    )}&grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(Quarter)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    const errorMessage = error instanceof Error ? error.message : "無法載入時間表資料";
    console.error("載入時間表資料錯誤:", error);
    toast.error(errorMessage);
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
        <svg
          className="h-5 w-5 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        錯誤：{errorMessage}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#80A8BD]"></div>
          <p className="mt-4 text-gray-600">載入中...</p>
        </div>
      </div>
    );
  }

  // 資料格式驗證
  if (
    !data ||
    !Array.isArray(data) ||
    !data.every(
      (item) =>
        typeof item.id === "string" &&
        typeof item.name === "string" &&
        typeof item.school === "string" &&
        (typeof item.grade === "string" || typeof item.grade === "number") &&
        typeof item.year === "string" &&
        (typeof item.quarter === "string" || typeof item.quarter === "number") &&
        typeof item.student_name === "string" &&
        typeof item.student_school_timetable_id === "string" &&
        typeof item.img === "string"
    )
  ) {
    console.error("無效的時間表資料:", data);
    toast.error("無效的時間表資料格式");
    return (
      <div className="flex items-center bg-red-50 text-red-600 p-4 rounded-lg">
        <svg
          className="h-5 w-5 text-red-500 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        無效的時間表資料格式
      </div>
    );
  }

  // 過濾數據
  const filteredData = data.filter(
    (d) =>
      d.school === SchoolName &&
      String(d.grade) === String(Grade) &&
      d.year === Year &&
      String(d.quarter) === String(Quarter)
  );

  // 定義季度對應對象
  const quarterMapping: { [key: string]: string } = {
    "1": "第一季度",
    "2": "第二季度",
    "3": "第三季度",
    "4": "第四季度",
  };

  return (
    <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminId}`} className="text-[#80A8BD] hover:text-cyan-200">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminId}/userLists`} className="text-[#80A8BD] hover:text-cyan-200">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          家長列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          學校時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(
            SchoolName
          )}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(
            SchoolName
          )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
          className="text-[#80A8BD] hover:text-cyan-200"
        >
          學年 {Year}
        </Link>
        <span className="mx-2">/</span>
        <span>{quarterMapping[Quarter] || `季度 ${Quarter}`}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-[#80A8BD] mb-4">
        {SchoolName} 年級 {Grade} 學年 {Year} {quarterMapping[Quarter] || `季度 ${Quarter}`} 時間表列表
      </h2>

      {filteredData.length === 0 && (
        <div className="text-gray-600 p-4 bg-white rounded-lg shadow-md">無時間表資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {filteredData.map((d) => (
          <Link
            key={d.id}
            className="text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(
              SchoolName
            )}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(
              d.id
            )}`}
          >
            名稱: {d.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SchoolTimeTableLists_Grade_Year_Quarter_Listsbysupadmin;

// "use client";

// import { useParams } from "next/navigation";
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolName {
//   id: string;
//   name: string;
//   school: string;
//   grade: string;
//   year: string;
//   quarter: string;
// }

// const SchoolTimeTableLists_Grade_Year_Quarter_Listsbysupadmin = () => {
//   const params = useParams<{
//     supadminid: string;
//     parentdetailbyID: string;
//     studentdetailbyID: string;
//     school: string;
//     grade: string;
//     year: string;
//     quarter: string;
//   }>();
//   const supadminId = params?.supadminid;
//   const ParentID = params?.parentdetailbyID;
//   const StudentID = params?.studentdetailbyID;
//   const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
//   const Grade = params?.grade ? decodeURIComponent(params.grade) : "";
//   const Year = params?.year ? decodeURIComponent(params.year) : "";
//   const Quarter = params?.quarter ? decodeURIComponent(params.quarter) : "";


//   console.log(params)

//   // 驗證路由參數
//   if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade || !Year || !Quarter) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：缺少必要路由參數
//       </div>
//     );
//   }

//   const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolName[]> =>
//     fetch(url, {
//     ...init, // 保留傳入的 init 配置（若有）
//     cache: 'no-store', // 強制不快取，確保每次請求新數據
//     headers: {
//       ...init?.headers, // 合併傳入的 headers（若有）
//       'Cache-Control': 'no-cache', // 設置快取控制頭部
//     },
//   }).then((res) => {
//       if (!res.ok) throw new Error(res.statusText);
//       return res.json();
//     });

//   const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:8000";
//   const { data, error, isLoading } = useSWR(
//     `${apiUrl}/api/student/Student_ScTimetable_by_id_Lists/${StudentID}?school=${encodeURIComponent(SchoolName)}&grade=${encodeURIComponent(Grade)}&year=${encodeURIComponent(Year)}&quarter=${encodeURIComponent(Quarter)}`,
//     fetcher,
//     { revalidateOnFocus: false }
//   );

//   // 錯誤處理
//   if (error) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         錯誤：無法載入時間表資料 - {error.message || "未知錯誤"}
//       </div>
//     );
//   }

//   // 載入中
//   if (isLoading) {
//     return <div className="text-gray-600 p-4">載入中...</div>;
//   }

//   // 資料格式驗證
//   if (
//     !data ||
//     !Array.isArray(data) ||
//     !data.every(
//       (item) =>
//         typeof item.id === "string" &&
//         typeof item.name === "string" &&
//         typeof item.school === "string" &&
//         typeof item.grade === "string" &&
//         typeof item.year === "string" &&
//         typeof item.quarter === "string"
//     )
//   ) {
//     return (
//       <div className="bg-red-50 text-red-600 p-4 rounded-lg">
//         無效的時間表資料格式
//       </div>
//     );
//   }

//   // 過濾數據
//   const filteredData = data.filter(
//     (d) => d.school === SchoolName && d.grade === Grade && d.year === Year && d.quarter === Quarter
//   );

//   return (
//     <div className="container mx-auto px-4 py-6 bg-blue-50 min-h-screen">
//       {/* 麵包屑導航 */}
//       <nav className="mb-4 text-sm">
//         <Link href={`/supadmin/${supadminId}`} className="text-blue-600 hover:text-blue-800">
//           主理員主頁
//         </Link>
//         <span className="mx-2">/</span>
//         <Link href={`/supadmin/${supadminId}/userLists`} className="text-blue-600 hover:text-blue-800">
//           用戶列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學生列表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學生詳情
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學校時間表
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           {SchoolName}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           年級 {Grade}
//         </Link>
//         <span className="mx-2">/</span>
//         <Link
//           href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}`}
//           className="text-blue-600 hover:text-blue-800"
//         >
//           學年 {Year}
//         </Link>
//         <span className="mx-2">/</span>
//         <span>季度 {Quarter}</span>
//       </nav>

//       <h2 className="text-2xl font-semibold text-blue-600 mb-4">
//         {SchoolName} 年級 {Grade} 學年 {Year} 季度 {Quarter} 時間表列表
//       </h2>

//       {filteredData.length === 0 && <div className="text-gray-600 p-4">無時間表資料</div>}

//       <div className="flex flex-col space-y-4">
//         {filteredData.map((d) => (
//           <Link
//             key={d.id}
//             className="text-blue-600 hover:text-blue-800 font-medium"
//             href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(Year)}/${encodeURIComponent(Quarter)}/${encodeURIComponent(d.id)}`}
//           >
//             名稱: {d.name}
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SchoolTimeTableLists_Grade_Year_Quarter_Listsbysupadmin;
// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolYear {
//     school_year: string;
// }
// const SchoolTimeTableLists_Grade_Yearbysupadmin = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;

//     const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolYear[]> => fetch(url, init).then((res) => res.json());
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolyears/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//       if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }

    
//     return(
//         <>
//             <span> SchoolTimeTableLists_Grade_Year </span>

//             {data.map((year)=>{
//             return(
//                 <>
//                 <br />
//                     <Link
//                         className="text-stone-950 hover:text-gray-700"
//                         href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${SchoolName}/${Grade}/${year.school_year}`}
//                     >
//                         年份 : {year.school_year}
//                     </Link>
//                 <br />
//                 </>
//             )
//         })
//         }
//         </>
//     )
// }

// export default SchoolTimeTableLists_Grade_Yearbysupadmin


"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

interface StudentSchoolYear {
  school_year: string;
}

const SchoolTimeTableLists_Grade_Yearbysupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    grade: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school ? decodeURIComponent(params.school) : "";
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Grade) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolYear[]> =>
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
    `${apiUrl}/api/School_data/schoolyears?school=${encodeURIComponent(SchoolName)}&grade=${encodeURIComponent(Grade)}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入學年資料 - {error.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (isLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 資料格式驗證
  if (!data || !Array.isArray(data) || !data.every((item) => typeof item.school_year === "string")) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學年資料格式
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
        <span>年級 {Grade}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} 年級 {Grade} 學年列表
      </h2>

      {data.length === 0 && <div className="text-gray-600 p-4">無學年資料</div>}

      <div className="flex flex-col space-y-4">
        {data.map((year) => (
          <Link
            key={year.school_year}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/schooltimetableLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}/${encodeURIComponent(year.school_year)}`}
          >
            年份 {year.school_year}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SchoolTimeTableLists_Grade_Yearbysupadmin;
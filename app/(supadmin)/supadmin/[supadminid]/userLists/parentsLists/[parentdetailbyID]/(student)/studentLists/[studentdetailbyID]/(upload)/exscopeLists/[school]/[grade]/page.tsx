// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolQuarter{
//     school_quarter:string
// }
// const ExScope_Grade_Quarterbysupadmin = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ;supadminId: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const supadminId = params?.supadminId as string;



//     const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolQuarter[]>  => fetch(url, init).then((res) => res.json());
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolquarters/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//       if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }



//     return(
//         <>
//             <span> ExScope_Grade_Quarter </span>
//             {data.map((quarters)=>{
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${quarters.school_quarter}`}
//                 >
//                     季度: {quarters.school_quarter}
//                 </Link>
//             <br />
//                     </>
//                 )
//             })}
//         </>
//     )
// }

// export default ExScope_Grade_Quarterbysupadmin


"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

// 定義季度對應對象
const quarterMapping: { [key: string]: string } = {
  "1": "第一季度",
  "2": "第二季度",
  "3": "第三季度",
  "4": "第四季度",
};

interface StudentSchoolQuarter {
  school_quarter: string;
}

const ExScope_Grade_Quarterbysupadmin = () => {
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

  const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolQuarter[]> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolquarters/`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入季度資料 - {error.message || "未知錯誤"}
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
    !data.every((item) => typeof item.school_quarter === "string")
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的季度資料格式
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試範圍
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <span>{Grade}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Grade} 考試範圍季度列表
      </h2>

      {data.length === 0 && (
        <div className="text-gray-600 p-4">無季度資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {data.map((quarters) => (
          <Link
            key={quarters.school_quarter}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${quarters.school_quarter}`}
          >
            {quarterMapping[quarters.school_quarter] || `季度 ${quarters.school_quarter}`}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ExScope_Grade_Quarterbysupadmin;
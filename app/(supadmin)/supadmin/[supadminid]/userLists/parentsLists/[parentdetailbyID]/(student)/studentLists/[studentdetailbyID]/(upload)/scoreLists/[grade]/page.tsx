// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolYear {
//     school_year: string;
// }
// const ScoreLists_YearbySupadmin = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string; supadminId: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const Grade = params?.grade as string;
//     const supadminId = params?.supadminId as string;


//     const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolYear[]> => fetch(url, init).then((res) => res.json());
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

//     const { data , error , isLoading } = useSWR(`http://127.0.0.1:8000/api/School_data/schoolyears/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//       if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }


//     return(
//         <>
//             <span> ScoreLists_Year </span>

//             {data.map((year)=>{
//             return(
//                 <>
//                 <br />
//                     <Link
//                         className="text-stone-950 hover:text-gray-700"
//                         href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${year.school_year}`}
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

// export default ScoreLists_YearbySupadmin


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

interface StudentSchoolYear {
  school_year: string;
}

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const ScoreLists_YearbySupadmin = () => {
  const params = useParams<{
    supadminid: string;
    parentdetailbyID: string;
    studentdetailbyID: string;
    grade: string;
  }>();
  const supadminId = params?.supadminid;
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const Grade = params?.grade ? decodeURIComponent(params.grade) : "";

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !Grade) {
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

  const apiUrl_DJANGO = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
  const apiUrl_NEXTJS = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";


  // 獲取學年資料
  const { data: yearsData, error: yearsError, isLoading: yearsLoading } = useSWR<StudentSchoolYear[]>(
    `${apiUrl_DJANGO}/api/School_data/schoolyears?studentId=${StudentID}&grade=${encodeURIComponent(Grade)}`,
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
  if (yearsError || studentError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(yearsError || studentError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (yearsLoading || studentLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證學年資料
  if (
    !yearsData ||
    !Array.isArray(yearsData) ||
    !yearsData.every((item) => typeof item.school_year === "string" && item.school_year)
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的學年資料格式
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

  // 過濾學年：若 API 不支援查詢參數，可根據需要添加前端過濾
  const filteredYears = yearsData; // 若 API 已過濾，則直接使用

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
        <span>{gradeMapping[Grade]}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {studentData[0].name} 的 {gradeMapping[Grade]} 學年列表
      </h2>

      {filteredYears.length === 0 && <div className="text-gray-600 p-4">無學年資料</div>}

      <div className="flex flex-col space-y-4">
        {filteredYears.map((year) => (
          <Link
            key={year.school_year}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}/${encodeURIComponent(year.school_year)}`}
          >
            學年 {year.school_year}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScoreLists_YearbySupadmin;
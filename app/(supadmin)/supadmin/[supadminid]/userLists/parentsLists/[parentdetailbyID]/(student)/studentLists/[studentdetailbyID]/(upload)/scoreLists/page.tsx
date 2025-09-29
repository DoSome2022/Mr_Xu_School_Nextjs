// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// // 定義年級對應對象
// const gradeMapping:{[key:string]:string} = {
//     "1": "小學1年級",
//     "2": "小學2年級",
//     "3": "小學3年級",
//     "4": "小學4年級",
//     "5": "小學5年級",
//     "6": "小學6年級",
//     "7": "初中1年級",
//     "8": "初中2年級",
//     "9": "初中3年級",
//     "10": "高中1年級",
//     "11": "高中2年級",
//     "12": "高中3年級",
//   };

//   interface Student_School_Grade {
//     school_grade: string
// }



// const ScoreListsbysupadmin = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; supadminId:string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const supadminId = params?.supadminId as string;


//     const fetcher = (url: string, init?: RequestInit):Promise<Student_School_Grade[]> => fetch(url, init).then((res) => res.json());
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//     if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }

//     return(
//         <>
//             <span> ScoreLists </span>
//             <br />
//             <Link
//                         className="text-stone-950 hover:text-gray-700"
//                         href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/upload`}
//                     >
//                         上傳成縝表
//                     </Link>

//             <br />
//             {data.map((grades)=>{
//             return(
//                 <>
//                 <br />
//                     <Link
//                         className="text-stone-950 hover:text-gray-700"
//                         href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${grades.school_grade}`}
//                     >
//                         {gradeMapping[grades.school_grade]}
//                     </Link>
//                 <br />
//                 </>
//             )
//         })
//         }

//         </>
//     )
// }

// export default ScoreListsbysupadmin


"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import useSWR from "swr";

// 定義年級對應對象
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

interface Student_School_Grade {
  id: number;
  school_grade: number;
}

interface StudentData {
  id: string;
  name: string;
  grade: number;
  school: string;
}

const ScoreListsbysupadmin = () => {
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

  const apiUrl_DJANGO = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://localhost:8000";
  const apiUrl_NEXTJS = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://localhost:3000";

  // 獲取年級資料
  const { data: gradesData, error: gradesError, isLoading: gradesLoading } = useSWR<Student_School_Grade[]>(
    `${apiUrl_DJANGO}/api/School_data/schoolgrades/`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 獲取學生資料
  const { data: studentData, error: studentError, isLoading: studentLoading } = useSWR<StudentData[]>(
    `${apiUrl_NEXTJS}/api/student/Student_Lists_detail_data_by_id/${StudentID}`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (gradesError || studentError) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入資料 - {(gradesError || studentError)?.message || "未知錯誤"}
      </div>
    );
  }

  // 載入中
  if (gradesLoading || studentLoading) {
    return <div className="text-gray-600 p-4">載入中...</div>;
  }

  // 驗證年級資料
  if (
    !gradesData ||
    !Array.isArray(gradesData) ||
    !gradesData.every((item) => typeof item.school_grade === "number" && gradeMapping[String(item.school_grade)])
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的年級資料格式
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

  // 過濾年級：僅顯示學生的當前年級
  const filteredGrades = gradesData.filter((grade) => grade.school_grade === studentData[0].grade);

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
        <span>成績表</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {studentData[0].name} 的成績表年級列表
      </h2>

      <div className="mb-4">
        <Link
          className="text-blue-600 hover:text-blue-800 font-medium"
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/upload`}
        >
          上傳成績表
        </Link>
      </div>

      {filteredGrades.length === 0 && <div className="text-gray-600 p-4">無年級資料</div>}

      <div className="flex flex-col space-y-4">
        {filteredGrades.map((grades) => (
          <Link
            key={grades.id}
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(String(grades.school_grade))}`}
          >
            {gradeMapping[String(grades.school_grade)]}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ScoreListsbysupadmin;
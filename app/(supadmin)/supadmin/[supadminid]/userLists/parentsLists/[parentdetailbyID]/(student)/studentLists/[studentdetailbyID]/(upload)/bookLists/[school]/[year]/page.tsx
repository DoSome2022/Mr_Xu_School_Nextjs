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


//   interface StudentGrades {
//     school_grade:string
//   }


// const Student_BookLists_School_Year_Gradebysupadmin = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string ; year : string; supadminId: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Year = params?.year as string;
//     const supadminId = params?.supadminId as string;

//     const fetcher = (url: string, init?: RequestInit):Promise<StudentGrades[]>  => fetch(url, init).then((res) => res.json());
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
//             Student_BookLists_School_Year_Gradebysupadmin

//         {data.map((grades)=>{
//             return(
//                 <>
//                 <br />
//                     <Link
//                         className="text-stone-950 hover:text-gray-700"
//                         href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${grades.school_grade}`}
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

// export default Student_BookLists_School_Year_Gradebysupadmin

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

interface StudentGrades {
  id: number;
  school_grade: number | string; // 接受數字或字串
}

const Student_BookLists_School_Year_Gradebysupadmin = () => {
  const params = useParams<{
    parentdetailbyID: string;
    studentdetailbyID: string;
    school: string;
    year: string;
    supadminid: string;
  }>();
  const ParentID = params?.parentdetailbyID;
  const StudentID = params?.studentdetailbyID;
  const SchoolName = params?.school;
  const Year = params?.year;
  const supadminId = params?.supadminid;

  // 驗證路由參數
  if (!supadminId || !ParentID || !StudentID || !SchoolName || !Year) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：缺少必要路由參數
      </div>
    );
  }

  const fetcher = (url: string, init?: RequestInit): Promise<StudentGrades[]> =>
    fetch(url, init).then((res) => {
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    });
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolgrades/`,
    fetcher,
    { revalidateOnFocus: false }
  );

  // 錯誤處理
  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        錯誤：無法載入年級資料 - {error.message || "未知錯誤"}
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
    !data.every((item) => typeof item.school_grade === "number" || typeof item.school_grade === "string")
  ) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        無效的年級資料格式
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/`}
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
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          書單
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <span>{Year}</span>
      </nav>

      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        {SchoolName} {Year} 年級書單
      </h2>

      {/* {data.length === 0 && (
        <div className="text-gray-600 p-4">無年級資料</div>
      )}

      <div className="flex flex-col space-y-4">
        {data.map((grades) => (
          <Link
            key={grades.id} // 使用 id 作為 key
            className="text-blue-600 hover:text-blue-800 font-medium"
            href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${grades.school_grade}`}
          >
            {gradeMapping[String(grades.school_grade)] || `未知年級 (${grades.school_grade})`}
          </Link>
        ))}
      </div> */}

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((grades) => (
            <div
              key={grades.school_grade}
              className="border border-gray-200 rounded p-4 bg-white shadow-sm"
            >
              <Link
                href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/bookLists/${SchoolName}/${Year}/${grades.school_grade}`}
                className="block text-[#80A8BD] hover:text-cyan-200 font-medium transition-colors duration-300"
              >
                {gradeMapping[grades.school_grade] || grades.school_grade}
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">無年級資料</p>
      )}

    </div>
  );
};

export default Student_BookLists_School_Year_Gradebysupadmin;
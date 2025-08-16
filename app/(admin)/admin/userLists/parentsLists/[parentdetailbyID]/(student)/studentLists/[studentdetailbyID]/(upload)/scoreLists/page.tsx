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



// const ScoreLists = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; }>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;

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
//                         href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/upload`}
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
//                         href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${grades.school_grade}`}
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

// export default ScoreLists

"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

const gradeMapping: {[key: string]: string} = {
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
  school_grade: string;
}

const ScoreLists = () => {
  const params = useParams<{parentdetailbyID: string; studentdetailbyID: string}>();
  const ParentID = params?.parentdetailbyID as string;
  const StudentID = params?.studentdetailbyID as string;

  const fetcher = (url: string, init?: RequestInit): Promise<Student_School_Grade[]> => 
    fetch(url, init).then((res) => res.json());
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
  const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/`, fetcher);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
            錯誤: {error.message}
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#e7915b]"></div>
            <p className="mt-2 text-gray-600">載入中...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-red-500">
            無效的資料格式
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* 標題欄 - 使用與 navbar 相同的配色 */}
          <div className="bg-[#e7915b] px-6 py-4">
            <h1 className="text-xl font-bold text-white">成績表管理</h1>
          </div>

          {/* 內容區域 */}
          <div className="p-6">
            <div className="space-y-6">
              {/* 上傳按鈕 */}
              <Link
                href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/upload`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#e7915b] hover:bg-[#d6824a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e7915b] transition-colors duration-300"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                上傳成績表
              </Link>

              {/* 年級列表 */}
              <div className="space-y-4">
                <h2 className="text-lg font-medium text-gray-900">選擇年級</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {data.map((grade) => (
                    <Link
                      key={grade.school_grade}
                      href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${grade.school_grade}`}
                      className="group block p-4 border border-gray-200 rounded-lg hover:border-[#e7915b] hover:bg-[#f8e5d8] transition-colors duration-300"
                    >
                      <div className="flex items-center">
                        <div className="bg-[#e7915b] text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 group-hover:bg-[#d6824a] transition-colors duration-300">
                          <span className="font-medium">{grade.school_grade}</span>
                        </div>
                        <span className="text-gray-800 group-hover:text-[#e7915b] transition-colors duration-300">
                          {gradeMapping[grade.school_grade]}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreLists;
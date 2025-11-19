// "use client";

// import useSWR from "swr";
// import { useParams } from "next/navigation";
// import Link from "next/link";

// interface SchoolYear {
//   school_year: string;
// }

// const fetcher = (url: string, init?: RequestInit): Promise<SchoolYear[]> =>
//   fetch(url, init).then((res) => res.json());
// const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// const SchoolTimeTableLists_Grade_Year = () => {
//   const params = useParams<{ grade: string; schooldetailbyID: string }>();
//   const SchoolId = params?.schooldetailbyID as string;
//   const GradeId = params?.grade as string;

//   const { data, error, isLoading } = useSWR(
//     `${apiUrl}/api/School_data/schoolyears/`,
//     fetcher
//   );

//   if (error)
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-red-500 text-sm">錯誤：{error.message}</div>
//         </div>
//       </div>
//     );

//   if (isLoading)
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-gray-700 text-sm">載入中...</div>
//         </div>
//       </div>
//     );

//   if (!data || !Array.isArray(data)) {
//     return (
//       <div className="min-h-screen bg-gray-100 pt-20">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-red-500 text-sm">無效的資料格式</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 pt-20">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="bg-white p-6 rounded-lg shadow-md">
//           <h1 className="text-2xl font-bold text-gray-800 mb-6">學校時間表 - 年份</h1>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {data.map((year) => (
//               <Link
//                 key={year.school_year}
//                 href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${year.school_year}`}
//                 className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
//               >
//                 年份 {year.school_year}
//               </Link>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SchoolTimeTableLists_Grade_Year;

"use client";


import useSWR from "swr";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolQuarter {
    school_quarter: string;
}

const SchoolTimeTableLists_Grade_Year_Quarter = () => {
    const params = useParams<{grade: string; year: string; quarter: string; schooldetailbyID: string; school: string; parentdetailbyID: string; studentdetailbyID: string;}>();
    console.log("params : ", params);
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as string;
    const SchoolName = params?.school as string;
    const YearId = params?.year as string;
    const ParentID = params?.parentdetailbyID as string;

    const fetcher = (url: string, init?: RequestInit): Promise<SchoolQuarter[]> => 
        fetch(url, init).then((res) => res.json());
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
    const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolquarters/`, fetcher);
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
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#80A8BD]"></div>
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

        // 季度對應中文
    const quarterMapping: {[key: string]: string} = {
        "1": "第一季",
        "2": "第二季",
        "3": "第三季",
        "4": "第四季"
    };

    return (
       <div className="min-h-screen bg-gray-50 pt-20">
        {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校資料
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/schooltimetableLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校名
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
        <span>{YearId}</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 標題欄 - 使用與 navbar 相同的配色 */}
                    <div className="bg-[#80A8BD] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            {SchoolName} - {gradeMapping[GradeId] || GradeId} - {YearId}年 - 選擇季度
                        </h1>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {data.map((quarter) => (
                                <Link
                                    key={quarter.school_quarter}
                                    href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${quarter.school_quarter}`}
                                    className="group block p-6 border border-gray-200 rounded-lg hover:border-[#80A8BD] hover:bg-[#f8e5d8] transition-colors duration-300 text-center"
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="bg-[#80A8BD] text-white rounded-full w-12 h-12 flex items-center justify-center mb-3 group-hover:bg-[#d6824a] transition-colors duration-300">
                                            <span className="text-xl font-bold">{quarter.school_quarter}</span>
                                        </div>
                                        <span className="text-gray-800 group-hover:text-[#80A8BD] transition-colors duration-300">
                                            {quarterMapping[quarter.school_quarter] || `第${quarter.school_quarter}季`}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
// 定義年級對應對象 (需放在組件外部)
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
export default SchoolTimeTableLists_Grade_Year_Quarter;
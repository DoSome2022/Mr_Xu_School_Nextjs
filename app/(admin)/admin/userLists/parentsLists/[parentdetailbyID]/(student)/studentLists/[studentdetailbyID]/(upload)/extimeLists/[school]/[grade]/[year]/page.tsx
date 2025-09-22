// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolQuarter{
//     school_quarter: number;
// }

// const ExTimeLists_Grade_Year_Quarter = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;

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
//             <span> ExTimeLists_Grade_Year_Quarter </span>


//             {data.map((quarters)=>{
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${quarters.school_quarter}`}
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

// export default ExTimeLists_Grade_Year_Quarter

"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface StudentSchoolQuarter {
    school_quarter: number;
}

const ExTimeLists_Grade_Year_Quarter = () => {
    const params = useParams<{
        parentdetailbyID: string;
        studentdetailbyID: string;
        school: string;
        grade: string;
        year: string;
    }>();
    
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;

    const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolQuarter[]> => 
        fetch(url, init).then((res) => res.json());
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
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
    const quarterMapping: {[key: number]: string} = {
        1: "第一季",
        2: "第二季",
        3: "第三季",
        4: "第四季"
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
             {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/admin`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/admin/userLists`} className="text-blue-600 hover:text-blue-800">
          用戶列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          考試時間表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {SchoolName}
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${encodeURIComponent(SchoolName)}/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          年級 {Grade}
        </Link>
        <span className="mx-2">/</span>
        <span>{Year}</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 標題欄 - 使用與 navbar 相同的配色 */}
                    <div className="bg-[#80A8BD] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            {SchoolName} - {Grade}年級 - {Year}年 - 選擇季度
                        </h1>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {data.map((quarter) => (
                                <Link
                                    key={quarter.school_quarter}
                                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${quarter.school_quarter}`}
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

export default ExTimeLists_Grade_Year_Quarter;
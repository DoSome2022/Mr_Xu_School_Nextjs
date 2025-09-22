// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";


// interface StudentSchoolQuarter{
//     school_quarter: number
// }

// const ScoreLists_Year_Quarter = () => {

//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string ; year: string;}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;


//     const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolQuarter[]> => fetch(url, init).then((res) => res.json());
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
//             <span> ScoreLists_Year_Quarter </span>
//             {data.map((quarters)=>{
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${quarters.school_quarter}`}
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

// export default ScoreLists_Year_Quarter

"use client";

import { useParams } from 'next/navigation';
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


interface StudentSchoolQuarter {
    school_quarter: number;
}

const ScoreLists_Year_Quarter = () => {
    const params = useParams<{ 
        parentdetailbyID: string; 
        studentdetailbyID: string;  
        grade: string; 
        year: string;
    }>();
    
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;

    const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolQuarter[]> => 
        fetch(url, init).then((res) => res.json());
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const { data, error, isLoading } = useSWR(
        `${apiUrl}/api/School_data/schoolquarters/`, 
        fetcher
    );

    if (error) return (
        <div className="pt-16 min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-red-500 font-medium">錯誤: {error.message}</h2>
                </div>
            </div>
        </div>
    );

    if (isLoading) return (
        <div className="pt-16 min-h-screen bg-gray-50 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md text-center">
                    <span className="text-[#80A8BD] animate-pulse">載入中...</span>
                </div>
            </div>
        </div>
    );

    if (!data || !Array.isArray(data)) {
        return (
            <div className="pt-16 min-h-screen bg-gray-50 p-4">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-red-500 font-medium">無效的資料格式</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-50">
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
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學生詳情
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          成績表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${encodeURIComponent(Grade)}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {gradeMapping[Grade]}
        </Link>
        <span className="mx-2">/</span>
        <span>{Year}</span>
      </nav>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-[#80A8BD] mb-2">
                            學年: {Year}
                        </h1>
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">
                            請選擇季度:
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data.map((quarter) => (
                                <Link
                                    key={quarter.school_quarter}
                                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${quarter.school_quarter}`}
                                    className="block p-6 border-2 border-[#80A8BD] rounded-lg hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-center"
                                >
                                    <span className="text-xl font-medium">
                                        第 {quarter.school_quarter} 季度
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreLists_Year_Quarter;
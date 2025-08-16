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
                    <span className="text-[#e7915b] animate-pulse">載入中...</span>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h1 className="text-2xl font-bold text-[#e7915b] mb-2">
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
                                    className="block p-6 border-2 border-[#e7915b] rounded-lg hover:bg-[#e7915b] hover:text-white transition-colors duration-300 text-center"
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
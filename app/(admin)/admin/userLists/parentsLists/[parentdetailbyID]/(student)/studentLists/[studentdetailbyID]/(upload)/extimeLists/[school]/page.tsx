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

//   interface StudentSchoolGrade{
//     school_grade: string
// }

// const ExTimeLists_Grade = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;

//     const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolGrade[]>  => fetch(url, init).then((res) => res.json());
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//       if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }

//     return(
//         <>
//             <span> ExTimeLists_Grade </span>
//             <br />
//             {data.map((grades)=>{
//             return(
//                 <>
//                 <br />
//                     <Link
//                         className="text-stone-950 hover:text-gray-700"
//                         href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${grades.school_grade}`}
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

// export default ExTimeLists_Grade

"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

// 定義年級對應對象
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

interface StudentSchoolGrade {
    school_grade: string;
}

const ExTimeLists_Grade = () => {
    const params = useParams<{parentdetailbyID: string; studentdetailbyID: string; school: string}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;

    const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolGrade[]> => 
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
        <div className="min-h-screen bg-gray-50 pt-20"> {/* pt-20 避免內容被 navbar 遮擋 */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 標題欄 - 使用與 navbar 相同的配色 */}
                    <div className="bg-[#e7915b] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            {SchoolName} - 選擇年級
                        </h1>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data.map((grades) => (
                                <Link
                                    key={grades.school_grade}
                                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${grades.school_grade}`}
                                    className="group block p-4 border border-gray-200 rounded-lg hover:border-[#e7915b] hover:bg-[#f8e5d8] transition-colors duration-300"
                                >
                                    <div className="flex items-center">
                                        <svg className="h-6 w-6 text-[#e7915b] mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <span className="text-gray-800 group-hover:text-[#e7915b] transition-colors duration-300">
                                            {gradeMapping[grades.school_grade]}
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

export default ExTimeLists_Grade;
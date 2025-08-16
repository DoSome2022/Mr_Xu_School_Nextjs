// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolSubject {
//     school_subject: string;
// }

// const ExTimeLists_Grade_Year_Quarter_subject = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string ; year: string; quarter:string}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const SchoolName = params?.school as string;
//     const Grade = params?.grade as string;
//     const Year = params?.year as string;
//     const Quarter = params?.quarter as string;

//     const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolSubject[]>  => fetch(url, init).then((res) => res.json());
//     const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"
//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//       if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }

//     return(
//         <>
//             <span> ExTimeLists_Grade_Year_Quarter_subject </span>

//             {data.map((subject)=>{
//                 return(
//                     <>
//             <br />
//                 <Link className="text-stone-950 hover:text-gray-700" 
//                     href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${subject.school_subject}`}
//                 >
//                     科目: {subject.school_subject}
//                 </Link>
//             <br />
//                     </>
//                 )
//             })}
//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_subject


"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface StudentSchoolSubject {
    school_subject: string;
}

const ExTimeLists_Grade_Year_Quarter_subject = () => {
    const params = useParams<{
        parentdetailbyID: string;
        studentdetailbyID: string;
        school: string;
        grade: string;
        year: string;
        quarter: string;
    }>();
    
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;

    const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolSubject[]> => 
        fetch(url, init).then((res) => res.json());
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/`, fetcher);

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

    // 科目圖標映射
    const subjectIcons: {[key: string]: string} = {
        "數學": "🧮",
        "語文": "📖",
        "英文": "🔠",
        "物理": "⚛️",
        "化學": "🧪",
        "生物": "🧬",
        "歷史": "🏛️",
        "地理": "🌍",
        "音樂": "🎵",
        "美術": "🎨",
        "體育": "⚽"
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {/* 標題欄 - 使用與 navbar 相同的配色 */}
                    <div className="bg-[#e7915b] px-6 py-4">
                        <h1 className="text-xl font-bold text-white">
                            {SchoolName} - {Grade}年級 - {Year}年 - 第{Quarter}季 - 選擇科目
                        </h1>
                    </div>

                    {/* 內容區域 */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data.map((subject) => (
                                <Link
                                    key={subject.school_subject}
                                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${subject.school_subject}`}
                                    className="group block p-4 border border-gray-200 rounded-lg hover:border-[#e7915b] hover:bg-[#f8e5d8] transition-colors duration-300"
                                >
                                    <div className="flex items-center">
                                        <span className="text-2xl mr-3">
                                            {subjectIcons[subject.school_subject] || "📚"}
                                        </span>
                                        <span className="text-gray-800 group-hover:text-[#e7915b] transition-colors duration-300">
                                            {subject.school_subject}
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

export default ExTimeLists_Grade_Year_Quarter_subject;
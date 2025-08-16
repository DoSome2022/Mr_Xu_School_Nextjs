// "use client";

// import { useParams } from 'next/navigation';
// import Link from "next/link";
// import useSWR from "swr";

// interface StudentSchoolYear {
//     school_year: string;
// }
// const ScoreLists_Year = () => {
//     const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string}>();
//     const ParentID = params?.parentdetailbyID as string;
//     const StudentID = params?.studentdetailbyID as string;
//     const Grade = params?.grade as string;

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
//                         href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${year.school_year}`}
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

// export default ScoreLists_Year

"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface StudentSchoolYear {
    school_year: string;
}

const ScoreLists_Year = () => {
    const params = useParams<{parentdetailbyID: string; studentdetailbyID: string; grade: string}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;

    const fetcher = (url: string, init?: RequestInit): Promise<StudentSchoolYear[]> => 
        fetch(url, init).then((res) => res.json());
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

    const { data, error, isLoading } = useSWR(`${apiUrl}/api/School_data/schoolyears/`, fetcher);

    if (error) return <div className="p-4 text-red-500">錯誤: {error.message}</div>;
    if (isLoading) return <div className="p-4 text-[#e7915b]">載入中...</div>;
    
    if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }

    return (
        <div className="pt-16 min-h-screen bg-gray-50"> {/* pt-16 是為了避開 fixed navbar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-bold text-[#e7915b] mb-6">成績年份列表</h1>
                
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            請選擇學年:
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {data.map((year) => (
                                <Link
                                    key={year.school_year}
                                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${year.school_year}`}
                                    className="block p-4 border border-[#e7915b] rounded-lg hover:bg-[#e7915b] hover:text-white transition-colors duration-300 text-center"
                                >
                                    <span className="font-medium">{year.school_year}</span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreLists_Year;
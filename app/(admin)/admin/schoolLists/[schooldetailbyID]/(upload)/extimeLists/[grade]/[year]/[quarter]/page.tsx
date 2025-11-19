// "use client";

// import useSWR from "swr";

// import { useParams } from 'next/navigation';

// import Link from "next/link";

// interface SchoolSubject {
//     school_subject: string;
//     grade: number;
//     quarter: number;
//     year: string;
// }



// const fetcher = (url: string, init?: RequestInit):Promise<SchoolSubject[]>  => fetch(url, init).then((res) => res.json());
// const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"


// const ExTimeLists_Grade_Year_Quarter_Subject = () =>{

//     const params = useParams<{grade : string; year : string; quarter: string; schooldetailbyID:string;}>();

//     const SchoolId = params?.schooldetailbyID  as String;
//     const GradeId = params?.grade as String;
//     const YearId = params?.year as String;
//     const QuarterId = params?.quarter as String;

//     const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

//     if(error) return <> error : {error} </>
//     if(isLoading) return <> 載入中 .... </>
//       // 確保 data 是陣列
//     if (!data || !Array.isArray(data)) {
//         return <div className="p-4 text-red-500">無效的資料格式</div>;
//     }
//     console.log(data)    


//     console.log(data)

//     return(
//         <>
//             ExTimeLists_Grade_Year_Quarter_Subject

//             {data.map((d) =>{
//                 // if(d.grade == Number(GradeId) && d.year == YearId && d.quarter == Number(QuarterId) ){}
//                     return(
//                         <>
//                             <br />
//                         <Link className="text-stone-950 hover:text-gray-700" 
//                         href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${d.school_subject}`}
//                     >
//                        科目: {d.school_subject}
//                         </Link>
    
//                             <br />
//                         </>
//                     )
                
//             })}
            

//         </>
//     )
// }

// export default ExTimeLists_Grade_Year_Quarter_Subject


"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Link from "next/link";

interface SchoolSubject {
  school_subject: string;
  grade: number;
  quarter: number;
  year: string;
}

const fetcher = (url: string, init?: RequestInit): Promise<SchoolSubject[]> =>
  fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";

const ExTimeLists_Grade_Year_Quarter_Subject = () => {
  const params = useParams<{
    grade: string;
    year: string;
    quarter: string;
    schooldetailbyID: string;
  }>();
  const SchoolId = params?.schooldetailbyID as string;
  const GradeId = params?.grade as string;
  const YearId = params?.year as string;
  const QuarterId = params?.quarter as string;

  const { data, error, isLoading } = useSWR(
    `${apiUrl}/api/School_data/schoolsubjects/`,
    fetcher
  );

  if (error)
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500 text-sm">錯誤：{error.message}</div>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-gray-700 text-sm">載入中...</div>
        </div>
      </div>
    );

  if (!data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-red-500 text-sm">無效的資料格式</div>
        </div>
      </div>
    );
  }

  // 過濾符合條件的科目
  // const filteredSubjects = data.filter(
  //   (d) =>
  //     d.grade === Number(GradeId) &&
  //     d.year === YearId &&
  //     d.quarter === Number(QuarterId)
  // );

console.log(" data :", data , " -- END -- ")
  
  return (
    <div className="min-h-screen bg-gray-100 pt-20">
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
          href={`/admin/schoolLists/${SchoolId}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校名
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
          <Link
          href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          {YearId}
        </Link>
        <span className="mx-2">/</span>
        <span>{QuarterId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試時間表 - 科目</h1>

          {data.length === 0 ? (
            <div className="text-gray-700 text-sm">暫無科目資料</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((d) => (
                <Link
                  key={d.school_subject}
                  href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${d.school_subject}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
                >
                  科目: {d.school_subject}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExTimeLists_Grade_Year_Quarter_Subject;
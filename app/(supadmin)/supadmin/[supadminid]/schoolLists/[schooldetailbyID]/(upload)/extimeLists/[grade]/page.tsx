"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";

interface SchoolYears {
    school_year: string;
}


    const fetcher = (url: string, init?: RequestInit):Promise<SchoolYears[]>  => fetch(url, init).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"


const ExTimeLists_Grade_Yearbysupadmin = () => {
    const params = useParams<{grade : string; schooldetailbyID : string; supadminid: string}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;

    console.log(params)

    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolyears/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
      if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }
    console.log(data)
    
   

    return(
        <>
            {/* ExTimeLists_Grade_Year

            {data.map((year)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${year.school_year}`}
                >
                   年份: {year.school_year}
                </Link>
            <br />
                    </>
                )
            })} */}

    <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm px-4 sm:px-6 lg:px-8">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學校列表
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校資料
        </Link>
        <span className="mx-2">/</span>
                <Link
          href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists`}
          className="text-blue-600 hover:text-blue-800"
        >
          學校名
        </Link>
        <span className="mx-2">/</span>
        <span>{GradeId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">考試時間表 - 年份</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((year) => (
              <Link
                key={year.school_year}
                href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${year.school_year}`}
                className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300 text-gray-800 font-medium text-center"
              >
                年份 {year.school_year}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>


        </>
    )
}
export default ExTimeLists_Grade_Yearbysupadmin
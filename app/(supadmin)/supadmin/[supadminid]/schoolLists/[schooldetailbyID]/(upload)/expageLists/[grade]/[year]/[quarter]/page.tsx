"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';

import useSWR from "swr";

interface SchoolSubject{
    school_subject: string;
}

const ExPageLists_grade_year_quarter_subject_bysupadmin = () => {


const params = useParams<{grade: string; year: string; quarter: string; schooldetailbyID:string; supadminid:string;}>();
const SchoolId = params?.schooldetailbyID as string;
const GradeId = params?.grade as string;
const YearId = params?.year as string;
const QuarterId = params?.quarter as string;
const supadminid = params?.supadminid as string;
console.log("supadminid :", supadminid);

const fetcher = (url: string, init?: RequestInit):Promise<SchoolSubject[]>  => fetch(url, {
    ...init, // 保留傳入的 init 配置（若有）
    cache: 'no-store', // 強制不快取，確保每次請求新數據
    headers: {
      ...init?.headers, // 合併傳入的 headers（若有）
      'Cache-Control': 'no-cache', // 設置快取控制頭部
    },
  }).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

  // 定義年級對應對象，與 ExPageLists 和 ExPageLists_year_grade 一致
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



if(error) return <> error : {error} </>
if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
if (!data || !Array.isArray(data)) {
    return <div className="p-4 text-red-500">無效的資料格式</div>;
}

console.log(data)

    return(
        <>
            {/* {data.map((subject)=>{
                return(
                    <>
                        <br />
                        <Link
                            className="text-stone-950 hover:text-gray-700" 
                            href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${subject.school_subject}`} 
                            >
                                科目: {subject.school_subject}
                        </Link>
                        <br />
                    </>
                )
            })} */}

      <div className="min-h-screen bg-gray-100 pt-20">
      {/* 麵包屑導航 */}
      <nav className="mb-4 text-sm">
        <Link href={`/supadmin/${supadminid}`} className="text-blue-600 hover:text-blue-800">
          主理員主頁
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/supadmin/${supadminid}/schoolLists`} className="text-blue-600 hover:text-blue-800">
          學枚列表
        </Link>
        <span className="mx-2">/</span>
            <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`} className="text-blue-600 hover:text-blue-800">
          學枚資料
        </Link>
        <span className="mx-2">/</span>
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists`} className="text-blue-600 hover:text-blue-800">
          學枚名
        </Link>
                <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          {GradeId}
        </Link>
        <span className="mx-2">/</span>
                
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}`} className="text-blue-600 hover:text-blue-800">
          {YearId}
        </Link>

        {/* <span className="mx-2">/</span>
          <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${YearId}/${GradeId}`} className="text-blue-600 hover:text-blue-800">
          {GradeId}
        </Link> */}

        <span className="mx-2">/</span>
        <span>{QuarterId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            考試卷 - {gradeMapping[GradeId] || GradeId} {YearId} 季度 {QuarterId} 科目列表
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳考試卷
            </Link>
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回季度列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">科目列表</h2>
          {data.length === 0 ? (
            <p className="text-gray-500">尚未新增科目</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {data.map((subject) => (
                <Link
                  key={subject.school_subject}
                  href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${subject.school_subject}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{subject.school_subject}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>

        </>
    )
}

export default ExPageLists_grade_year_quarter_subject_bysupadmin
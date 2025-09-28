"use client";

import BookLists_grade_Links from "@/components/uploadpauth/adminbookpath/BookLists_grade";
import Link from "next/link";
import { useParams } from 'next/navigation';

import useSWR from "swr";
import {  useEffect, useState } from "react";

// 定義年級對應對象
const gradeMapping:{[key:string]:string} = {
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

  interface StudentGrades {
    school_grade:string
  }
interface SchoolData {
    school_name: string;
}



const School_detail_data_by_id_bookLists_year_gradebysupadmin = () =>{

    
const params = useParams<{year: string ; schooldetailbyID : string ; supadminid: string}>();//plz use console.log check params name
    const SchoolId = params?.schooldetailbyID as string;// 獲取URL中的SchoolId參數
    const yearId = params?.year as string// 獲取URL中的yearId參數
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    console.log("params : ", params)    


    const fetcher = (url: string, init?: RequestInit):Promise<StudentGrades[]>  => fetch(url, {
    ...init, // 保留傳入的 init 配置（若有）
    cache: 'no-store', // 強制不快取，確保每次請求新數據
    headers: {
      ...init?.headers, // 合併傳入的 headers（若有）
      'Cache-Control': 'no-cache', // 設置快取控制頭部
    },
  }).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"
    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolgrades/` , fetcher);
    const apiUrl_nextjs = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";
    const [ getschooldata , setgetschooldata ] = useState<SchoolData[] | null>(null);

    useEffect(() => {
        if (SchoolId) {
          const fetchSchoolData = async (id: string) => {
            try {
              const res = await fetch(`${apiUrl_nextjs}/api/School_Lists_by_id/${id}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
              if (!res.ok) {
                throw new Error("斷線！");
              }
              const result = await res.json();
              setgetschooldata(result);
            } catch (error) {
              console.error(error);
            }
          }
        fetchSchoolData(SchoolId)

        }
    }, [SchoolId]);


    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
      if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }

  console.log("getschooldata : ", getschooldata)

const SchoolName = getschooldata && getschooldata[0] ? getschooldata[0].school_name : undefined;

  console.log("SchoolName :" , SchoolName)

    return(
        <>
            {/* {data.map((grades)=>{
                return(
                    <>
                    <br />
                        <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}/${grades.school_grade}`}
                        >
            
                            {gradeMapping[grades.school_grade]}
                        
                        </Link>
                    <br />
                    </>
                )
            }) 
            } */}
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
                    <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists`} className="text-blue-600 hover:text-blue-800">
          書單年份列表
        </Link>
        <span className="mx-2">/</span>
        <span>{yearId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">年級書單 - {yearId}</h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回年份列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">

                      
                      {data.map((grades)=>{
                return(
                    <>
                    <br />
                        <Link className="block p-4 bg-gray-50 rounded-md hover:bg-[#e7915b] hover:text-white transition-colors duration-300" 
                        key={grades.school_grade}
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}/${grades.school_grade}`}
                        >
            <p className="text-gray-800 font-semibold">

                            {gradeMapping[grades.school_grade]}
            </p>
                        
                        </Link>
                    <br />
                    </>

                    
                )
            }) 
            }

            </div>
        </div>
      </div>
    </div>
        
        
        </>
    )

}

export default School_detail_data_by_id_bookLists_year_gradebysupadmin
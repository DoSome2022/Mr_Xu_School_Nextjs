"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";
import {  useEffect, useState } from "react";

interface SchoolYear {
    school_year: string; 
}

interface SchoolData {
    school_name: string;
}


const fetcher = (url: string, init?: RequestInit):Promise<SchoolYear[]>  => fetch(url, init).then((res) => res.json());


const BookLists_yearsbysupadmin = () => {

    const params = useParams();
    const SchoolId = params.schooldetailbyID as string;
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    console.log(SchoolId);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO || "http://127.0.0.1:8000";
    const apiUrl_nextjs = process.env.NEXT_PUBLIC_API_URL_For_NEXTJS || "http://127.0.0.1:3000";
    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolyears/` , fetcher);
    const [ getschooldata , setgetschooldata ] = useState<SchoolData[] | null>(null);

    useEffect(() => {
        if (SchoolId) {
          const fetchSchoolData = async (id: string) => {
            try {
              const res = await fetch(`${apiUrl_nextjs}/api/School_Lists_by_id/${id}`);
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


    if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-gray-600 text-lg">正在加載...</p>
      </div>
    );
  }

  if (error || !data || !Array.isArray(data)) {
    return (
      <div className="min-h-screen bg-gray-100 pt-20 flex justify-center items-center">
        <p className="text-red-500 bg-red-100 p-3 rounded-md">
          {error?.message || "無法載入年份資料"}
        </p>
      </div>
    );
  }

  console.log("getschooldata : ", getschooldata)

const SchoolName = getschooldata && getschooldata[0] ? getschooldata[0].school_name : undefined;

  console.log("SchoolName :" , SchoolName)

return(
    <>



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
        <span>{SchoolName}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">書單年份列表</h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/upload`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              上傳書單
            </Link>
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回學校詳情
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">年份列表</h2>
          {data.length === 0 ? (
            <p className="text-gray-500">尚未新增年份</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {data.map((year) => (
                <Link
                  key={year.school_year}
                  href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${year.school_year}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{year.school_year}</p>
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

export default BookLists_yearsbysupadmin
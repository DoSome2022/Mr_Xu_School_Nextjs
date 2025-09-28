"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
//     為了拿 booklists data id/year/grade

// const fetcher = (...args) => fetch(...args).then((res) => res.json());

// const { data , error , isLoading } = useSWR(`http://localhost:3000/api/Booklists_by_id/${SchoolId}/${yearId}/${GradeId.toString()}` , fetcher);


//     為了拿 booklists data id/year/


// const fetcher = (...args) => fetch(...args).then((res) => res.json());

//const { data , error , isLoading } = useSWR(`http://localhost:3000/api/Booklists_by_id/${SchoolId}/${yearId}}` , fetcher);


//     為了拿 booklists data id/


// const fetcher = (...args) => fetch(...args).then((res) => res.json());
// const { data , error , isLoading } = useSWR(`/api/Booklists_by_id/${SchoolId}` , fetcher);


interface SchoolBookData {
    id: string;
    name: string;
    year : string;
    grade: number;
    school_booklist_id: string;
}

const School_detail_data_by_id_bookLists_year_grade_booklistbysupadmin = () =>{

    const params = useParams<{year: string ; grade: string; schooldetailbyID: string; supadminid:string;}>();//plz use console.log check params name
    const SchoolId = params?.schooldetailbyID as string;// 獲取URL中的SchoolId參數
    const yearId = params?.year as string// 獲取URL中的yearId參數
    const GradeId = params?.grade as string // 獲取URL中的GradeId參數
        const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    console.log("params : ", params)

    
const [ GetBooklistsDataById , setGetBooklistsDataById ] = useState<SchoolBookData[]>([]);



useEffect(() =>{
    if(SchoolId && yearId && GradeId) {
        const getBooklitsDetail = async (id: string ,yearId:string , GradeId:string) => {
            try {
            const res = await fetch(`/api/Booklists_by_id/${id}/${yearId}/${GradeId}`, {
                cache: 'no-store',  // 強制不快取，確保每次請求新數據
                headers: {
                    'Cache-Control': 'no-cache',
                },
            });
            if(!res.ok) {
                throw new Error("斷線！");
            }
            const result = await res.json();
            setGetBooklistsDataById(result);                    
            } catch (error) {
                console.error(error);
            }
        };
        getBooklitsDetail(SchoolId,yearId,GradeId);
    }
},[SchoolId ,yearId , GradeId] )
    

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


    console.log("-- booklist Data : --",GetBooklistsDataById,"-- end --")

    return(
        <>
            bookLists
        {/* {GetBooklistsDataById.map((d)=>{
            if(d.grade == Number(GradeId) && d.year == yearId &&  d.school_booklist_id == SchoolId
                // 
            ){
                return(
                    <>
                <br />
                            <Link className="text-stone-950 hover:text-gray-700" 
                            href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}/${GradeId}/${d.id}`}
                            >
                                name:{d.name} 
                                <br />
                            </Link>
                        <br />
                        </> 
                )

            }
        })}        */}

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
                
                    <Link href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}`} className="text-blue-600 hover:text-blue-800">
          {yearId}
        </Link>

        <span className="mx-2">/</span>
        <span>{GradeId}</span>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#80A8BD]">
            書單列表 - {yearId} {gradeMapping[GradeId] || GradeId}
          </h1>
          <div className="flex space-x-4">
            <Link
              href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}`}
              className="inline-block text-white bg-[#80A8BD] px-4 py-2 rounded-md hover:bg-cyan-200 hover:text-gray-800 transition-colors duration-300"
            >
              返回年級列表
            </Link>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">書單列表</h2>
          {GetBooklistsDataById.length === 0 ? (
            <p className="text-gray-500">尚未新增書單</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {GetBooklistsDataById.map((book) => (
                <Link
                  key={book.id}
                  href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/bookLists/${yearId}/${GradeId}/${book.id}`}
                  className="block p-4 bg-gray-50 rounded-md hover:bg-[#80A8BD] hover:text-white transition-colors duration-300"
                >
                  <p className="text-gray-800 font-semibold">{book.name}</p>
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

export default School_detail_data_by_id_bookLists_year_grade_booklistbysupadmin
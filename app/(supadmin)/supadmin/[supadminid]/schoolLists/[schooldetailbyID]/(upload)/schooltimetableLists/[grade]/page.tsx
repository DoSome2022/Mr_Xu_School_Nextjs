"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";

interface SchoolYear{
    school_year : string
}


const fetcher = (url: string, init?: RequestInit):Promise<SchoolYear[]>  => fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

const SchoolTimeTableLists_Grade_Yearbysupadmin = () => {
    const params = useParams<{grade : string; schooldetailbyID:string;supadminid:string;}>();
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
            SchoolTimeTableLists_Grade_Year

            {data.map((year)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${year.school_year}`}
                >
                   年份: {year.school_year}
                </Link>
            <br />
                    </>
                )
            })}

        </>
    )
}
export default SchoolTimeTableLists_Grade_Yearbysupadmin
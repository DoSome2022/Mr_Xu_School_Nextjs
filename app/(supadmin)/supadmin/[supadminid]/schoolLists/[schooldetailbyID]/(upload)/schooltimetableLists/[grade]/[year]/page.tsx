"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";

interface SchoolQuarter {
    school_quarter: number;
}

const fetcher = (url: string, init?: RequestInit):Promise<SchoolQuarter[]>  => fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

const SchoolTimeTableLists_Grade_Year_Quarterbysupadmin = () =>{

    const params = useParams<{grade : string; year : string; schooldetailbyID:string;supadminid:string;}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;
    const YearId = params?.year as String;

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolquarters/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
    if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }
    console.log(data)

    return(
        <>
            SchoolTimeTableLists_Grade_Year_Quarter

            {data.map((quarter) =>{
                return(
                    <>
                        <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${quarter.school_quarter}`}
                >
                   季度: {quarter.school_quarter}
                    </Link>

                        <br />
                    </>
                )
            })}
            

        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarterbysupadmin
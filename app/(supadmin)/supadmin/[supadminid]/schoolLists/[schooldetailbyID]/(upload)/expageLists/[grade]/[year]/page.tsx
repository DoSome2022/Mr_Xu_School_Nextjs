"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import useSWR from "swr";

interface SchoolQuarter {
    school_quarter: string;
}
const ExPageLists_grade_year_quarter_bysupadmin = () => {

    const params = useParams<{grade: string; year: string; schooldetailbyID:string; supadminid:string;}>();
    const SchoolId = params?.schooldetailbyID as String;
    const GradeId = params?.grade as String;
    const YearId = params?.year as String;
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);

    const fetcher = (url: string, init?: RequestInit):Promise<SchoolQuarter[]>  => fetch(url, init).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"
    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolquarters/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
      if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }
  
    return(
        <>
            {
                data.map((quarter)=>{
                    return(
                        <>
                        <br />
                        <Link
                        className="text-stone-950 hover:text-gray-700" 
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${quarter.school_quarter}`} 
                        >
                            季度:{quarter.school_quarter}
                        </Link>
                        <br />
                        </>
                    )
                })

            }

        </>
    )
}

export default ExPageLists_grade_year_quarter_bysupadmin
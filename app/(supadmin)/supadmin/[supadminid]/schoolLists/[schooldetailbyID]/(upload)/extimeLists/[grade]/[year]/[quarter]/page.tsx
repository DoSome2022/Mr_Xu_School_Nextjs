"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";

interface SchoolSubject {
    school_subject: string;
    grade: number;
    quarter: number;
    year: string;
}



const fetcher = (url: string, init?: RequestInit):Promise<SchoolSubject[]>  => fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"


const ExTimeLists_Grade_Year_Quarter_Subjectbysupadmin = () =>{

    const params = useParams<{grade : string; year : string; quarter: string; schooldetailbyID:string;supadminid:string}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;
    const YearId = params?.year as String;
    const QuarterId = params?.quarter as String;

    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
    if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }
    console.log(data)    


    console.log(data)

    return(
        <>
            ExTimeLists_Grade_Year_Quarter_Subject

            {data.map((d) =>{
                // if(d.grade == Number(GradeId) && d.year == YearId && d.quarter == Number(QuarterId) ){}
                    return(
                        <>
                            <br />
                        <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${d.school_subject}`}
                    >
                       科目: {d.school_subject}
                        </Link>
    
                            <br />
                        </>
                    )
                
            })}
            

        </>
    )
}

export default ExTimeLists_Grade_Year_Quarter_Subjectbysupadmin
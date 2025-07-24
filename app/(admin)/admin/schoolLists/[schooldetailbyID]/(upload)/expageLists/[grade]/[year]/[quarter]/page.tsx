"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';

import useSWR from "swr";

interface SchoolSubject{
    school_subject: string;
}

const ExPageLists_grade_year_quarter_subject = () => {


const params = useParams<{grade: string; year: string; quarter: string; schooldetailbyID:string}>();
const SchoolId = params?.schooldetailbyID as String;
const GradeId = params?.grade as String;
const YearId = params?.year as String;
const QuarterId = params?.quarter as String;

const fetcher = (url: string, init?: RequestInit):Promise<SchoolSubject[]>  => fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"
const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

if(error) return <> error : {error} </>
if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
if (!data || !Array.isArray(data)) {
    return <div className="p-4 text-red-500">無效的資料格式</div>;
}

console.log(data)

    return(
        <>
            {data.map((subject)=>{
                return(
                    <>
                        <br />
                        <Link
                            className="text-stone-950 hover:text-gray-700" 
                            href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${subject.school_subject}`} 
                            >
                                科目: {subject.school_subject}
                        </Link>
                        <br />
                    </>
                )
            })}
        </>
    )
}

export default ExPageLists_grade_year_quarter_subject
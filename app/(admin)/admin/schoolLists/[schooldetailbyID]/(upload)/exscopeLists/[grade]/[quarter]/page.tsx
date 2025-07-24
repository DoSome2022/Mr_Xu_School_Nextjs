"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";

interface SchoolSubject {
    school_subject : string
}


const fetcher = (url: string, init?: RequestInit):Promise<SchoolSubject[]>  => fetch(url, init).then((res) => res.json());
const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

const ExScopeLists_Grade_Quarter_subject = () =>{


    const params = useParams<{grade : string ; quarter: string; schooldetailbyID:string;}>();

    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;
    const QuarterId = params?.quarter as String;

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
            <span>ExScopeLists_Grade_Quarter_subject</span>

            {data.map((subject)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${subject.school_subject}`}
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

export default ExScopeLists_Grade_Quarter_subject
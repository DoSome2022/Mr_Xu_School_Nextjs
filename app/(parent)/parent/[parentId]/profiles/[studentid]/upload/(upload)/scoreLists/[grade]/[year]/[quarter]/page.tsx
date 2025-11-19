"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface StudentQuarter {
    school_subject:string
}
const ScoreLists_Year_Quarter_Subject = () => {
    const params = useParams<{parentId : string ; studentid : string ;  grade : string ; year: string; quarter:string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;

  const fetcher = (url: string, init?: RequestInit):Promise<StudentQuarter[]>  => fetch(url, init).then((res) => res.json());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO|| "http://127.0.0.1:8000"
    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
        // 確保 data 是陣列
        if (!data || !Array.isArray(data)) {
            return <div className="p-4 text-red-500">無效的資料格式</div>;
        }


    return(
        <>
            <span> ScoreLists_Year_Quarter_Subject </span>

            {data.map((subject)=>{
                return(
                    <div key={subject.school_subject}>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${Year}/${Quarter}/${subject.school_subject}`}
                >
                    科目: {subject.school_subject}
                </Link>
            <br />
                    </div>
                )
            })}

        </>
    )
}

export default ScoreLists_Year_Quarter_Subject
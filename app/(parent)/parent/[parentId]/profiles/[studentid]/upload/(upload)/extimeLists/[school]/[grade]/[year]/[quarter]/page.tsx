"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface StudentSubject {
    school_subject: string;
}
const ExTimeLists_Grade_Year_Quarter_subject = () => {
    const params = useParams<{parentId : string ; studentid : string ; school : string; grade : string ; year: string; quarter:string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;

  const fetcher = (url: string, init?: RequestInit):Promise<StudentSubject[]>  => fetch(url, init).then((res) => res.json());
  const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"

    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolsubjects/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
        // 確保 data 是陣列
        if (!data || !Array.isArray(data)) {
            return <div className="p-4 text-red-500">無效的資料格式</div>;
        }


    return(
        <>
            <span> ExTimeLists_Grade_Year_Quarter_subject </span>

            {data.map((subject:any)=>{
                return(
                    <div key={subject.school_subject}> {/* 添加 key 属性 */}
                        <br />
                        <Link className="text-stone-950 hover:text-gray-700" 
                            href={`/parent/${ParentID}/profiles/${StudentID}/upload/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${subject.school_subject}`}
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

export default ExTimeLists_Grade_Year_Quarter_subject
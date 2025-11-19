"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

interface SchoolYear{
    id: string;
    school_year: string;
}

const ExPageLists_Grade_Year = () => {

    const params = useParams<{parentId : string ; studentid : string ; school : string; grade : string}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;

  const fetcher = (url: string, init?: RequestInit):Promise<SchoolYear[]>  => fetch(url, init).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_For_DJANGO|| "http://127.0.0.1:8000"
    const { data , error , isLoading } = useSWR(`${apiUrl}/api/School_data/schoolyears/` , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
      // 確保 data 是陣列
      if (!data || !Array.isArray(data)) {
        return <div className="p-4 text-red-500">無效的資料格式</div>;
    }

    return(
        <>
            <span> ExPageLists_Grade_Year </span>


            {data.map((year)=>{
            return(
                <>
                <br />
                    <Link
                        className="text-stone-950 hover:text-gray-700"
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/expageLists/${SchoolName}/${Grade}/${year.school_year}`}
                    >
                        年份 : {year.school_year}
                    </Link>
                <br />
                </>
            )
        })
        }
            
        </>
    )
}

export default ExPageLists_Grade_Year
"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";


interface StudentSchoolQuarter{
    school_quarter: number
}

const ScoreLists_Year_Quarter = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : string ; year: string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;


    const fetcher = (url: string, init?: RequestInit):Promise<StudentSchoolQuarter[]> => fetch(url, init).then((res) => res.json());
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
            <span> ScoreLists_Year_Quarter </span>
            {data.map((quarters)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/scoreLists/${Grade}/${Year}/${quarters.school_quarter}`}
                >
                    季度: {quarters.school_quarter}
                </Link>
            <br />
                    </>
                )
            })}
        </>
    )
}

export default ScoreLists_Year_Quarter
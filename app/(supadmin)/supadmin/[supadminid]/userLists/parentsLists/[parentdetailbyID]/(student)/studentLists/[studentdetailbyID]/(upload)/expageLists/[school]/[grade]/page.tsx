"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";


interface Student_School_Year {
    school_year: string;
}


const ExPageLists_Grade_Yearbysupadmin = () => {

    const params = useParams<{ supadminId: string ;parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : string}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const supadminId = params?.supadminId as string;


    const fetcher = (url: string, init?: RequestInit):Promise<Student_School_Year[]>  => fetch(url, init).then((res) => res.json());
    const apiUrl = process.env.NEXT_PUBLIC_API_URL|| "http://127.0.0.1:8000"
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
                        href={`/supadmin/${supadminId}/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/expageLists/${SchoolName}/${Grade}/${year.school_year}`}
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

export default ExPageLists_Grade_Yearbysupadmin
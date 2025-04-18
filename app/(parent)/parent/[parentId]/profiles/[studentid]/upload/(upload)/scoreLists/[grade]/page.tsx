"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

const ScoreLists_Year = () => {
    const params = useParams<{parentId : string ; studentid : string ;  grade : number}>();
    const ParentID = params?.parentId as string;
    const StudentID = params?.studentid as string;
    const Grade = params?.grade as number;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolyears/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>



    return(
        <>
            <span> ScoreLists_Year </span>

            {data.map((year:any)=>{
            return(
                <div key={year.school_year}>
                <br />
                    <Link
                        className="text-stone-950 hover:text-gray-700"
                        href={`/parent/${ParentID}/profiles/${StudentID}/upload/scoreLists/${Grade}/${year.school_year}`}
                    >
                        年份 : {year.school_year}
                    </Link>
                <br />
                </div>
            )
        })
        }
        </>
    )
}

export default ScoreLists_Year
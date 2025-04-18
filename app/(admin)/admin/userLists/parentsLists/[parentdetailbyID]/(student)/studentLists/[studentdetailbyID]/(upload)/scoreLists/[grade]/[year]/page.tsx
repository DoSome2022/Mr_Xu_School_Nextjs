"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";


const ScoreLists_Year_Quarter = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ;  grade : number ; year: string;}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;


    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolquarters/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>


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
"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";



const ExTimeLists_Grade_Year_Quarter_subject = () => {
    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : number ; year: string; quarter:number}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as number;
    const Year = params?.year as string;
    const Quarter = params?.quarter as number;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolsubjects/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>


    return(
        <>
            <span> ExTimeLists_Grade_Year_Quarter_subject </span>

            {data.map((subject)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/extimeLists/${SchoolName}/${Grade}/${Year}/${Quarter}/${subject.school_subject}`}
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

export default ExTimeLists_Grade_Year_Quarter_subject
"use client";

import { useParams } from 'next/navigation';
import Link from "next/link";
import useSWR from "swr";

const ExScope_Grade_Quarter_Subject = () => {

    const params = useParams<{parentdetailbyID : string ; studentdetailbyID : string ; school : string; grade : number ; quarter : number}>();
    const ParentID = params?.parentdetailbyID as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as number;
    const Quarter = params?.quarter as number;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolsubjects/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>


    return(
        <>
            <span> ExScope_Grade_Quarter_Subject </span>

            {data.map((subject)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/userLists/parentsLists/${ParentID}/studentLists/${StudentID}/exscopeLists/${SchoolName}/${Grade}/${Quarter}/${subject.school_subject}`}
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

export default ExScope_Grade_Quarter_Subject
"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";


const fetcher = (...args) => fetch(...args).then((res) => res.json());




const ExScopeLists_Grade_Quarter_subject = () =>{


    const params = useParams<{grade : string ; quarter: string}>();

    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;
    const QuarterId = params?.quarter as String;

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolsubjects/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
    
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
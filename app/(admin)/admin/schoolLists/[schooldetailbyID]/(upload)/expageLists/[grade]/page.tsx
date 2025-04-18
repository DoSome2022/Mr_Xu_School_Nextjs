"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';

import useSWR from "swr";


const ExPageLists_year_grade = () => {

    const params = useParams<{grade: string}>();
    const SchoolId = params?.schooldetailbyID as String;
    const GradeId = params?.grade as String;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolyears/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>

    return(
        <>
        {
            data.map((year)=>{
                return(
                    <>
                    <br />
                        <Link 
                            className="text-stone-950 hover:text-gray-700" 
                            href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${year.school_year}`}
                        >
                            {year.school_year}
                        </Link>
                    <br />
                    </>
                )
            })
        }
        </>
    )
}

export default ExPageLists_year_grade
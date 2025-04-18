"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";


const fetcher = (...args) => fetch(...args).then((res) => res.json());





const SchoolTimeTableLists_Grade_Year = () => {
    const params = useParams<{grade : string}>();

    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;

    console.log(params)

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolyears/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>
    
   

    return(
        <>
            SchoolTimeTableLists_Grade_Year

            {data.map((year)=>{
                return(
                    <>
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${year.school_year}`}
                >
                   年份: {year.school_year}
                </Link>
            <br />
                    </>
                )
            })}

        </>
    )
}
export default SchoolTimeTableLists_Grade_Year
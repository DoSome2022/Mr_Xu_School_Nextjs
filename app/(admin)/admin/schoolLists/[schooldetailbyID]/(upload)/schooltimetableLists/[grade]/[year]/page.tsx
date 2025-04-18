"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';

import Link from "next/link";


const fetcher = (...args) => fetch(...args).then((res) => res.json());



const SchoolTimeTableLists_Grade_Year_Quarter = () =>{

    const params = useParams<{grade : string; year : string}>();

    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;
    const YearId = params?.year as String;

    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolquarters/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>

    console.log(data)

    return(
        <>
            SchoolTimeTableLists_Grade_Year_Quarter

            {data.map((quarter) =>{
                return(
                    <>
                        <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${quarter.school_quarter}`}
                >
                   季度: {quarter.school_quarter}
                    </Link>

                        <br />
                    </>
                )
            })}
            

        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter
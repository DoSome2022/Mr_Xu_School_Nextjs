"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';

import useSWR from "swr";

const ExPageLists_grade_year_quarter = () => {

    const params = useParams<{grade: string; year: string}>();
    const SchoolId = params?.schooldetailbyID as String;
    const GradeId = params?.grade as String;
    const YearId = params?.year as String;

    const fetcher = (...args) => fetch(...args).then((res) => res.json());
    const { data , error , isLoading } = useSWR('http://127.0.0.1:8000/api/School_data/schoolquarters/' , fetcher);

    if(error) return <> error : {error} </>
    if(isLoading) return <> 載入中 .... </>

  
    return(
        <>
            {
                data.map((quarter)=>{
                    return(
                        <>
                        <br />
                        <Link
                        className="text-stone-950 hover:text-gray-700" 
                        href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${quarter.school_quarter}`} 
                        >
                            季度:{quarter.school_quarter}
                        </Link>
                        <br />
                        </>
                    )
                })

            }

        </>
    )
}

export default ExPageLists_grade_year_quarter
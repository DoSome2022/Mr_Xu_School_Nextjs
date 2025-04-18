"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

import Link from "next/link";




const SchoolTimeTableLists_Grade_Year_Quarter_Subject = () =>{

    const params = useParams<{grade : string; year : string; quarter: string}>();

    const SchoolId = params?.schooldetailbyID  as String;
    const GradeId = params?.grade as String;
    const YearId = params?.year as String;
    const QuarterId = params?.quarter as String;

    const [ GetSchoolTimeTableListsById , setGetSchoolTimeTableListsById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId ) {
            const getSchoolTimeTableListsDetail = async (SchoolId: string ,yearId:string , GradeId:number ,QuarterId:number ) => {
                try {
                const res = await fetch(`/api/Schooltimetablelists_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetSchoolTimeTableListsById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getSchoolTimeTableListsDetail(SchoolId,YearId,GradeId,QuarterId);
        }
    },[SchoolId,YearId,GradeId,QuarterId] )


    console.log("-- ExPageLists Data : --",GetSchoolTimeTableListsById,"-- end --")




    return(
        <>
            SchoolTimeTableLists_Grade_Year_Quarter

            {GetSchoolTimeTableListsById.map((d)=>{
            return(
                <>
                                        <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/schoolLists/${SchoolId}/schooltimetableLists/${GradeId}/${YearId}/${QuarterId}/${d.id}`}
                >
                   name:{d.name}
                    </Link>

                        <br />
                
                
                </>
            )
        })}

        </>
    )
}

export default SchoolTimeTableLists_Grade_Year_Quarter_Subject
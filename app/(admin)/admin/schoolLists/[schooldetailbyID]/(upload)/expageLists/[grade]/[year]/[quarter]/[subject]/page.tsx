
"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

import useSWR from "swr";



const ExPageLists_grade_year_quarter_subject_expagelists = () => {
    const params = useParams<{grade: number; year: string; quarter: number; subject: string}>();
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as number;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as number;
    const SubjectId = params?.subject as string;




    const [ GetExPageListsDataById , setGetExPageListsDataById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId ) {
            const getExPageListsDetail = async (SchoolId: string  , GradeId:number,yearId:string ,QuarterId:number, SubjectId:string) => {
                try {
                const res = await fetch(`/api/Expagelists_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExPageListsDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExPageListsDetail(SchoolId,GradeId,YearId,QuarterId,SubjectId);
        }
    },[SchoolId,GradeId,YearId,QuarterId,SubjectId] )


    console.log("-- ExPageLists Data : --",GetExPageListsDataById,"-- end --")

    return(
        <>
            ExPageLists_grade_year_quarter_subject_expagelists
            {GetExPageListsDataById.map((d)=>{
                return(
                    <>
                        <br />
                        <Link
                            className="text-stone-950 hover:text-gray-700" 
                            href={`/admin/schoolLists/${SchoolId}/expageLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`} 
                            >
                              name:{d.name}
                              <br />
                        </Link>
                        <br />
                    </>
                )
            })}



        </>
    )
}

export default ExPageLists_grade_year_quarter_subject_expagelists
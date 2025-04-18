"use client";

import useSWR from "swr";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";



const ExTimeLists_Grade_Year_Quarter_Subject_extimelists = () =>{

    const params = useParams<{grade : number; year : string; quarter: number; subject: string}>();

    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as number;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as number;
    const SubjectId = params?.subject as string;


    const [ GetExTimeListsDataById , setGetExTimeListsDataById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId) {
            const getExTimeListsDetail = async (SchoolId: string  , GradeId:number,yearId:string ,QuarterId:number ,SubjectId: string) => {
                try {
                const res = await fetch(`/api/Extimelists_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExTimeListsDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExTimeListsDetail(SchoolId,GradeId,YearId,QuarterId,SubjectId);
        }
    },[SchoolId,GradeId,YearId,QuarterId,SubjectId] )


    console.log("-- ExTimeLists Data : --",GetExTimeListsDataById,"-- end --")


    return(
        <>
            ExTimeLists_Grade_Year_Quarter_Subject_extimelists
            {GetExTimeListsDataById.map((d)=>{
                return(
                    <>
                        <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/schoolLists/${SchoolId}/extimeLists/${GradeId}/${YearId}/${QuarterId}/${SubjectId}/${d.id}`}
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

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists
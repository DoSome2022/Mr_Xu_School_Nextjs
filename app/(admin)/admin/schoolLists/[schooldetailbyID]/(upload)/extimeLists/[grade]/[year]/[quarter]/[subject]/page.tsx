"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolExTime {
    id: string;
    name: string;
    grade: number;
    quarter: number;
    year:string;
    subject: string;
}


const ExTimeLists_Grade_Year_Quarter_Subject_extimelists = () =>{

    const params = useParams<{grade : string; year : string; quarter: string; subject: string; schooldetailbyID:string}>();
    console.log("params :" , params)
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';


    const [ GetExTimeListsDataById , setGetExTimeListsDataById ] = useState<SchoolExTime[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId) {
            const getExTimeListsDetail = async (SchoolId: string , GradeId:string,yearId:string ,QuarterId:string ,SubjectId: string) => {
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
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId){
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

                }
            })}


            

        </>
    )
}

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists
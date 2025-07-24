
"use client";

import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

interface SchoolData{
    id: string;
    name: string;
    grade: number;
    year: string;
    quarter: number;
    subject: string;
}

const ExPageLists_grade_year_quarter_subject_expagelists = () => {
    const params = useParams<{grade: string; year: string; quarter: string; subject: string; schooldetailbyID:string;}>();
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';




    const [ GetExPageListsDataById , setGetExPageListsDataById ] = useState<SchoolData[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId ) {
            const getExPageListsDetail = async (SchoolId: string , GradeId:string,yearId:string ,QuarterId:string, SubjectId:string) => {
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
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId){
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

                }
            })}



        </>
    )
}

export default ExPageLists_grade_year_quarter_subject_expagelists
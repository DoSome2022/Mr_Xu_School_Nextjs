"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

interface SchoolName {
    id: string;
    name: string;
    grade: number;
    quarter: number;
    subject: string;
}
const ExScopeLists_Grade_Subject_exscpelistsbysupadmin = () => {

    const params = useParams<{grade : string ; quarter: string ; subject: string ; schooldetailbyID: string ; supadminid: string ;}>();
    console.log("params :" , params)
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) :'';
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const [ GetExScopeListsDataById , setGetExScopeListsDataById ] = useState<SchoolName[]>([]);

    useEffect(() =>{
        if(SchoolId && GradeId && QuarterId && SubjectId) {
            const getExScopeListsDetail = async (SchoolId: string  , GradeId:string ,QuarterId:string ,SubjectId: string) => {
                try {
                const res = await fetch(`/api/Exscopelists_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExScopeListsDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExScopeListsDetail(SchoolId,GradeId,QuarterId,SubjectId);
        }
    },[SchoolId,GradeId,QuarterId,SubjectId] )


    console.log("-- ExScopeLists Data : --",GetExScopeListsDataById,"-- end --")


    return(
        <>
            ExScopeLists_Grade_Subject_exscpelists
            {GetExScopeListsDataById.map((d)=>{
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.subject == SubjectId){
                    return(
                        <>
                    
                <br />
                    <Link className="text-stone-950 hover:text-gray-700" 
                        href={`/supadmin/${supadminid}/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}/${d.id}`}
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

export default ExScopeLists_Grade_Subject_exscpelistsbysupadmin
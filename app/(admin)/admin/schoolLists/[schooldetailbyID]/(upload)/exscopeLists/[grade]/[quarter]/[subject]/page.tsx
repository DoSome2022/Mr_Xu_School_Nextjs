"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Link from "next/link";

const ExScopeLists_Grade_Subject_exscpelists = () => {

    const params = useParams<{grade : number ; quarter: number ; subject: string }>();

    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as number;
    const QuarterId = params?.quarter as number;
    const SubjectId = params?.subject as string;
 
    const [ GetExScopeListsDataById , setGetExScopeListsDataById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId && GradeId && QuarterId && SubjectId) {
            const getExScopeListsDetail = async (SchoolId: string  , GradeId:number ,QuarterId:number ,SubjectId: string) => {
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
                return(
                    <>
                
            <br />
                <Link className="text-stone-950 hover:text-gray-700" 
                    href={`/admin/schoolLists/${SchoolId}/exscopeLists/${GradeId}/${QuarterId}/${SubjectId}/${d.id}`}
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

export default ExScopeLists_Grade_Subject_exscpelists
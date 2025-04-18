"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 


const ExScopeLists_Grade_Subject_exscpelists = () =>{

    const params = useParams<{grade : number ; quarter: number ; subject: string; id:string }>();

    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as number;
    const QuarterId = params?.quarter as number;
    const SubjectId = params?.subject as string;
    const ExScopeListById = params?.id as string;

    const [ GetExScopeListDetailDataById , setGetExScopeListDetailDataById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId  && GradeId && QuarterId && SubjectId && ExScopeListById) {
            const getExScopeListDetailById = async (SchoolId: string  , GradeId:number ,QuarterId:number,SubjectId:string,ExScopeListById:string ) => {
                try {
                const res = await fetch(`/api/Exscopelists_detail_data_by_id/${SchoolId}/${GradeId}/${QuarterId}/${SubjectId}/${ExScopeListById}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExScopeListDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExScopeListDetailById(SchoolId,GradeId,QuarterId,SubjectId,ExScopeListById);
        }
    },[SchoolId,GradeId,QuarterId,SubjectId,ExScopeListById] )


    console.log(GetExScopeListDetailDataById)
    return(
        <>
                    <>
            {GetExScopeListDetailDataById.map((d)=>{
                                return(
                                    <>
                                    name:{d.name}
                
                                    <br />
                
                                    {
                                        d.img && (
                                            <Image width={500} height={500} src={d.img} alt="" />
                                        )
                
                                    }
                                    </>
                                )
            })}
        </>
        </>
    )
}

export default ExScopeLists_Grade_Subject_exscpelists
"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 

interface SchoolExScopeData{
    name: string;
    img: string;
    grade: number;
    quarter: number;
    subject: string;
    schooldetailbyID:  string;
}

const ExScopeLists_Grade_Subject_exscpelistsbysupadmin = () =>{

    const params = useParams<{grade : string ; quarter: string ; subject: string; id:string; schooldetailbyID:string;supadminid:string; }>();
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    const ExScopeListById = params?.id as string;
    console.log("params :" , params);
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);

    const [ GetExScopeListDetailDataById , setGetExScopeListDetailDataById ] = useState<SchoolExScopeData[]>([]);

    useEffect(() =>{
        if(SchoolId  && GradeId && QuarterId && SubjectId && ExScopeListById) {
            const getExScopeListDetailById = async (SchoolId: string  , GradeId:string ,QuarterId:string,SubjectId:string,ExScopeListById:string ) => {
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
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.subject == SubjectId && d.schooldetailbyID == SchoolId){
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
                }

            })}
        </>
        </>
    )
}

export default ExScopeLists_Grade_Subject_exscpelistsbysupadmin
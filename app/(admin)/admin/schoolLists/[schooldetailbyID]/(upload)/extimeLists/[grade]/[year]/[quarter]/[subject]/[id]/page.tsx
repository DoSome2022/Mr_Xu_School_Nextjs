"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 

const ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail = () =>{
    const params = useParams<{grade : number; year : string; quarter: number; subject: string ,id:string}>();

    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as number;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as number;
    const SubjectId = params?.subject as string;
    const ExTimeListById = params?.id as string; // 獲取URL中的Id參數

    const [ GetExTimeListsDetailDataById , setGetExTimeListsDetailDataById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId) {
            const getExTimeListsDetailById = async (SchoolId: string  , GradeId:number,yearId:string ,QuarterId:number ,SubjectId: string ,ExTimeListById:string) => {
                try {
                const res = await fetch(`/api/Extimelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}/${ExTimeListById}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExTimeListsDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExTimeListsDetailById(SchoolId,GradeId,YearId,QuarterId,SubjectId,ExTimeListById);
        }
    },[SchoolId,GradeId,YearId,QuarterId,SubjectId,ExTimeListById] )


    console.log("-- ExTimeLists Data : --",GetExTimeListsDetailDataById,"-- end --")



    return(
        <>
            {GetExTimeListsDetailDataById.map((d)=>{
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
    )
}

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail
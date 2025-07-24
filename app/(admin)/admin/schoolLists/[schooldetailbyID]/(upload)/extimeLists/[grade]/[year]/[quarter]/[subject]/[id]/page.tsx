"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 

interface SchoolExTimeData {
    name: string;
    img: string;
    grade: number;
    quarter: number;
    subject: string;
    year: string;
    student_ex_timetable_id: string;
}


const ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail = () =>{
    const params = useParams<{grade : string; year : string; quarter: string; subject: string ,id:string, schooldetailbyID:string}>();
    console.log("params :" , params)
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    const ExTimeListById = params?.id as string; // 獲取URL中的Id參數

    const [ GetExTimeListsDetailDataById , setGetExTimeListsDetailDataById ] = useState<SchoolExTimeData[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId) {
            const getExTimeListsDetailById = async (SchoolId: string  , GradeId:string,yearId:string ,QuarterId:string ,SubjectId: string ,ExTimeListById:string) => {
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
                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.subject == SubjectId && d.year == YearId && d.student_ex_timetable_id == ExTimeListById){
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
    )
}

export default ExTimeLists_Grade_Year_Quarter_Subject_extimelists_Detail
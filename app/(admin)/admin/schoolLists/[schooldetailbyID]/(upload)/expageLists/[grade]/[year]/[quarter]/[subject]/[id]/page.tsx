"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 

const ExPageLists_grade_year_quarter_subject_expagelists_by_id = () => {

    const params = useParams<{grade: number; year: string; quarter: number; subject: string, id:string}>();
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as number;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as number;
    const SubjectId = params?.subject as string;
    const ExPageListById = params?.id as string; // 獲取URL中的Id參數




    const [ GetExPageListDetailDataById , setGetExPageListDetailDataById ] = useState<any>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId && ExPageListById) {
            const getExPageListsDetailById = async (SchoolId: string ,yearId:string , GradeId:number ,QuarterId:number,SubjectId:string,ExPageListById:string ) => {
                try {
                const res = await fetch(`/api/Expagelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SubjectId}/${ExPageListById}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetExPageListDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getExPageListsDetailById(SchoolId,YearId,GradeId,QuarterId,SubjectId,ExPageListById);
        }
    },[SchoolId,YearId,GradeId,QuarterId,SubjectId,ExPageListById] )


    console.log(GetExPageListDetailDataById)




    return(
        <>
            {GetExPageListDetailDataById.map((d)=>{
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

export default ExPageLists_grade_year_quarter_subject_expagelists_by_id
"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import Image from "next/image"; 

interface SchoolExPageData {
    name: string;
    img: string;
    school_ex_pager_id: string;
    grade: number;
    subject: string;
    year: string;
    quarter: number;
}
const ExPageLists_grade_year_quarter_subject_expagelists_by_id_bysupadmin = () => {

    const params = useParams<{grade: string; year: string; quarter: string; subject: string, id:string ,schooldetailbyID:string; supadminid:string }>();
    const SchoolId = params?.schooldetailbyID as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SubjectId = params?.subject ? decodeURIComponent(params.subject) : '';
    const ExPageListById = params?.id as string; // 獲取URL中的Id參數
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);

    const [ GetExPageListDetailDataById , setGetExPageListDetailDataById ] = useState<SchoolExPageData[]>([]);

    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId && SubjectId && ExPageListById) {
            const getExPageListsDetailById = async (SchoolId: string ,yearId:string , GradeId:string ,QuarterId:string,SubjectId:string,ExPageListById:string ) => {
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
                                if(d.grade == Number(GradeId) && d.quarter == Number(QuarterId) && d.year == YearId && d.subject == SubjectId && d.school_ex_pager_id == SchoolId){
                                
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

export default ExPageLists_grade_year_quarter_subject_expagelists_by_id_bysupadmin
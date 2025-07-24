"use client";
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";

interface SchoolTimeTable {
    name: string;
    img: string;
    grade: number;
    quarter: number;
    year: string;
    schooldetailbyID:string;
}

const SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detailbysupadmin = () =>{
    const params = useParams<{grade : string; year : string; quarter: string; id:string; schooldetailbyID:string;supadminid:string;}>();
    const supadminid = params?.supadminid as string;
    console.log("supadminid :", supadminid);
    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as string;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as string;
    const SchoolTimeTableListById = params?.id as string;

    const [ GetSchoolTimeTableListDetailDataById , setGetSchoolTimeTableListDetailDataById ] = useState<SchoolTimeTable[]>([]);


    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId &&  SchoolTimeTableListById) {
            const getSchoolTimeTableListsDetailById = async (SchoolId: string ,yearId:string , GradeId:string ,QuarterId:string,SchoolTimeTableListById:string ) => {
                try {
                const res = await fetch(`/api/Schooltimetablelists_detail_data_by_id/${SchoolId}/${GradeId}/${yearId}/${QuarterId}/${SchoolTimeTableListById}`);
                if(!res.ok) {
                    throw new Error("斷線！");
                }
                const result = await res.json();
                setGetSchoolTimeTableListDetailDataById(result);                    
                } catch (error) {
                    console.error(error);
                }
            };
            getSchoolTimeTableListsDetailById(SchoolId,YearId,GradeId,QuarterId,SchoolTimeTableListById);
        }
    },[SchoolId,YearId,GradeId,QuarterId,SchoolTimeTableListById] )


    console.log(GetSchoolTimeTableListDetailDataById)

    return(
        <>
            {GetSchoolTimeTableListDetailDataById.map((d)=>{
                if(d.grade  == Number(GradeId) && d.year == YearId && d.quarter == Number(QuarterId) && d.schooldetailbyID == SchoolTimeTableListById){
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

export default SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detailbysupadmin
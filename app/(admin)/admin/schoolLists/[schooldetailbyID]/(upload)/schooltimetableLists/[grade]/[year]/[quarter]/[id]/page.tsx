"use client";
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";



const SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail = () =>{
    const params = useParams<{grade : number; year : string; quarter: number; id:string;}>();

    const SchoolId = params?.schooldetailbyID  as string;
    const GradeId = params?.grade as number;
    const YearId = params?.year as string;
    const QuarterId = params?.quarter as number;
    const SchoolTimeTableListById = params?.id as string;

    const [ GetSchoolTimeTableListDetailDataById , setGetSchoolTimeTableListDetailDataById ] = useState<any>([]);


    useEffect(() =>{
        if(SchoolId && YearId && GradeId && QuarterId &&  SchoolTimeTableListById) {
            const getSchoolTimeTableListsDetailById = async (SchoolId: string ,yearId:string , GradeId:number ,QuarterId:number,SchoolTimeTableListById:string ) => {
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

export default SchoolTimeTableLists_Grade_Year_Quarter_Subject_extimelists_Detail
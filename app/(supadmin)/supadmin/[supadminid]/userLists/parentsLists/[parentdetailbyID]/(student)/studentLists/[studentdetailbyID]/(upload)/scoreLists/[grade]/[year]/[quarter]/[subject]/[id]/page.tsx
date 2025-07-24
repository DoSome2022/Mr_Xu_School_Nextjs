"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StudentDetailData {
    name: string;
    img: string;
    id : string;
    grade: string;
    year: string;
    quarter: string;
    subject: string;
}
const ScoreLists_Year_Quarter_Subject_List_By_IDbysupadmin = () => {
    const params = useParams<{ studentdetailbyID : string ; id : string ;parentdetailbyID : string ;  grade : string ; year: string; quarter:string; subject: string;}>();
    const StudentID = params?.studentdetailbyID as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';
    const Id = params?.id as string;

    const [ GetStudentScoreDetailByID , setGetStudentScoreDetailByID] = useState<StudentDetailData[]>([]);

    useEffect(()=>{
        if(StudentID && Id){
            const getstudentscoredetailbyid = async (StudentID: string, id: string) => {
                try {
                    const res = await fetch(`/api/student/Student_Score_by_id_Lists_by_id/${StudentID}/${id}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentScoreDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentscoredetailbyid(StudentID , Id)
        }
    },[StudentID , Id])


    console.log(GetStudentScoreDetailByID[0])

    return(
        <>
            <span> ScoreLists_Year_Quarter_Subject_List_By_ID </span>
            <br />
{GetStudentScoreDetailByID.map((d)=>{
    if(d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject && d.id == Id) {
    return(
        <>
        {d.name}
        <br />
        <Image 
                    width={500}
                    height={500}
                    src={d.img}
                    alt=""
                    />
        </>
    )        
    }

})}
        </>
    )
}

export default ScoreLists_Year_Quarter_Subject_List_By_IDbysupadmin
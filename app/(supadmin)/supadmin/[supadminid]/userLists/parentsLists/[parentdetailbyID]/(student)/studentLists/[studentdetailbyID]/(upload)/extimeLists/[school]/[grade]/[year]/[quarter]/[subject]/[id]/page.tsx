"use client";

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StudentDetailData{
    name:string;
    img:string;
    id:string;
    school:string;
    grade:string;
    year:string;
    quarter:string;
    subject:string;
}
const ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin = () => {
    const params = useParams<{ studentdetailbyID : string ; id: string; school : string; grade : string; year: string; quarter:string; subject:string}>();
    const Id = params?.id as string;
    const StudentID = params?.studentdetailbyID as string;
    const SchoolName = params?.school as string;
    const Grade = params?.grade as string;
    const Year = params?.year as string;
    const Quarter = params?.quarter as string;
    const Subject = params?.subject ? decodeURIComponent(params.subject) : '';

    const [ GetStudentExTimeDetailByID , setGetStudentExTimeDetailByID ] = useState<StudentDetailData[]>([]);

    useEffect(()=>{
        if(StudentID && Id){
            const getstudentextimedetailbyid = async (StudentID: string , id: string) => {
                try {
                    const res = await fetch(`/api/student/Student_ExTime_by_id_Lists_by_id/${StudentID}/${id}`)
                    if(!res.ok) {
                        throw new Error("斷線！");
                    }
                    const result = await res.json();
                    setGetStudentExTimeDetailByID(result);                    
                } catch (error) {
                    console.error(error)
                }
            };
            getstudentextimedetailbyid(StudentID,Id)
        }
    },[StudentID , Id])


    console.log(GetStudentExTimeDetailByID)

    return(
        <>
            <span> ExTimeLists_Grade_Year_Quarter_subject_Lists_By_ID </span>
            <br />
{GetStudentExTimeDetailByID.map((d)=>{
    if(d.school == SchoolName && d.grade == Grade && d.year == Year && d.quarter == Quarter && d.subject == Subject){
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

export default ExTimeLists_Grade_Year_Quarter_subject_Lists_By_IDbysupadmin